using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using TicketSystem.API.Data;
using TicketSystem.API.Models.DTOs;
using TicketSystem.API.Models.Entities;
using TicketSystem.API.Models.Enums;
using Xunit;

namespace TicketSystem.API.Tests;

public class TicketsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public TicketsControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    private async Task<string> GetAuthTokenAsync(HttpClient client)
    {
        // Ensure an admin user exists (seed covers this only for production DB, so we add here if missing)
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        if (!db.Admins.Any())
        {
            db.Admins.Add(new Admin
            {
                FirstName = "Administrador",
                LastName = "Teste",
                Email = "admin@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
            db.SaveChanges();
        }

        var payload = new { Email = "admin@test.com", Password = "admin123" };
        var resp = await client.PostAsJsonAsync("/api/auth/login", payload);
        resp.EnsureSuccessStatusCode();
        var json = await resp.Content.ReadFromJsonAsync<LoginResponseStub>();
        return json!.Token;
    }

    private record LoginResponseStub(string Token, object User);

    [Fact]
    public async Task GetTickets_Unauthorized_WithoutToken()
    {
        var client = _factory.CreateClient();
        var resp = await client.GetAsync("/api/tickets");
        resp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetTickets_ReturnsEmptyList_WhenNoTickets()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var resp = await client.GetAsync("/api/tickets");
        resp.StatusCode.Should().Be(HttpStatusCode.OK);
        var doc = await resp.Content.ReadFromJsonAsync<dynamic>();
        ((int)doc!.data.total).Should().Be(0);
    }

    [Fact]
    public async Task CreateTicket_ValidPayload_CreatesAndReturns201()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Need existing department & customer
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var dept = db.Departments.First();
            var customer = db.Customers.First();

            var create = new CreateTicketDto
            {
                Subject = "Teste de criação",
                Description = "Descrição de teste",
                Priority = TicketPriority.Normal,
                DepartmentId = dept.Id,
                CustomerId = customer.Id
            };

            var resp = await client.PostAsJsonAsync("/api/tickets", create);
            resp.StatusCode.Should().Be(HttpStatusCode.Created);
            var body = await resp.Content.ReadFromJsonAsync<dynamic>();
            ((string)body!.message).Should().Contain("Ticket criado");
            ((string)body!.data.subject).Should().Be("Teste de criação");
        }
    }

    [Fact]
    public async Task CreateTicket_MissingRequiredField_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var invalid = new { description = "Sem subject", priority = 1, departmentId = 1 };
        var resp = await client.PostAsJsonAsync("/api/tickets", invalid);
        resp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task AssignTicket_AdminOnly_ReturnsUnauthorizedForNoToken()
    {
        var client = _factory.CreateClient();
        var resp = await client.PutAsJsonAsync("/api/tickets/1/assign", new { agentId = 1 });
        resp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task AssignTicket_AdminWithToken_ButTicketMissing_ReturnsNotFound()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client); // token de admin
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var resp = await client.PutAsJsonAsync("/api/tickets/999/assign", new { agentId = 1 });
        resp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetTicket_ById_NotFound()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var resp = await client.GetAsync("/api/tickets/98765");
        resp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetTickets_FilterByStatus_ReturnsOnlyMatching()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Seed two tickets with different status via API
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var dept = db.Departments.First();
            var customer = db.Customers.First();
            db.Tickets.Add(new Ticket
            {
                Number = Ticket.GenerateTicketNumber(),
                Subject = "A",
                Description = "A",
                Priority = TicketPriority.Normal,
                DepartmentId = dept.Id,
                CustomerId = customer.Id,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            });
            db.Tickets.Add(new Ticket
            {
                Number = Ticket.GenerateTicketNumber(),
                Subject = "B",
                Description = "B",
                Priority = TicketPriority.Normal,
                DepartmentId = dept.Id,
                CustomerId = customer.Id,
                Status = TicketStatus.InProgress,
                CreatedAt = DateTime.UtcNow
            });
            db.SaveChanges();
        }

        var resp = await client.GetAsync("/api/tickets?status=" + (int)TicketStatus.Open);
        resp.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await resp.Content.ReadFromJsonAsync<dynamic>();
        int total = json!.data.total;
        total.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task GetTickets_SearchQuery_FiltersBySubject()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var dept = db.Departments.First();
            var customer = db.Customers.First();
            db.Tickets.Add(new Ticket
            {
                Number = Ticket.GenerateTicketNumber(),
                Subject = "XptoEspecial",
                Description = "Desc",
                Priority = TicketPriority.Normal,
                DepartmentId = dept.Id,
                CustomerId = customer.Id,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            });
            db.SaveChanges();
        }

        var resp = await client.GetAsync("/api/tickets?q=XptoEspecial");
        resp.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await resp.Content.ReadFromJsonAsync<dynamic>();
        int total = json!.data.total;
        total.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task AssignTicket_Admin_Success()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        int ticketId;
        int agentId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var dept = db.Departments.First();
            var customer = db.Customers.First();
            var agent = new Agent
            {
                FirstName = "Agente",
                LastName = "Teste",
                Email = "agent@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("agent123"),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            db.Agents.Add(agent);
            db.SaveChanges();
            agentId = agent.Id;

            var ticket = new Ticket
            {
                Number = Ticket.GenerateTicketNumber(),
                Subject = "AssignTest",
                Description = "Desc",
                Priority = TicketPriority.Normal,
                DepartmentId = dept.Id,
                CustomerId = customer.Id,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            };
            db.Tickets.Add(ticket);
            db.SaveChanges();
            ticketId = ticket.Id;
        }

        var resp = await client.PutAsJsonAsync($"/api/tickets/{ticketId}/assign", new { agentId });
        resp.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task UpdateStatus_ValidTransition_Works()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        int ticketId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var dept = db.Departments.First();
            var customer = db.Customers.First();
            var ticket = new Ticket
            {
                Number = Ticket.GenerateTicketNumber(),
                Subject = "StatusTest",
                Description = "Desc",
                Priority = TicketPriority.Normal,
                DepartmentId = dept.Id,
                CustomerId = customer.Id,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            };
            db.Tickets.Add(ticket);
            db.SaveChanges();
            ticketId = ticket.Id;
        }

        // First transition Open -> InProgress via status endpoint
        var resp = await client.PutAsJsonAsync($"/api/tickets/{ticketId}/status", new { newStatus = TicketStatus.InProgress });
        resp.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task UpdateStatus_InvalidTransition_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        int ticketId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var dept = db.Departments.First();
            var customer = db.Customers.First();
            var ticket = new Ticket
            {
                Number = Ticket.GenerateTicketNumber(),
                Subject = "InvalidStatusTest",
                Description = "Desc",
                Priority = TicketPriority.Normal,
                DepartmentId = dept.Id,
                CustomerId = customer.Id,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            };
            db.Tickets.Add(ticket);
            db.SaveChanges();
            ticketId = ticket.Id;
        }

        // Open -> Resolved é inválido diretamente
        var resp = await client.PutAsJsonAsync($"/api/tickets/{ticketId}/status", new { newStatus = TicketStatus.Resolved });
        resp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetTickets_Pagination_Works()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var dept = db.Departments.First();
            var customer = db.Customers.First();
            for (int i = 0; i < 35; i++)
            {
                db.Tickets.Add(new Ticket
                {
                    Number = Ticket.GenerateTicketNumber(),
                    Subject = "PageTest" + i,
                    Description = "Desc",
                    Priority = TicketPriority.Normal,
                    DepartmentId = dept.Id,
                    CustomerId = customer.Id,
                    Status = TicketStatus.Open,
                    CreatedAt = DateTime.UtcNow.AddMinutes(-i)
                });
            }
            db.SaveChanges();
        }

        var resp = await client.GetAsync("/api/tickets?page=2&pageSize=10");
        resp.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await resp.Content.ReadFromJsonAsync<dynamic>();
        int page = json!.data.page;
        int pageSize = json!.data.pageSize;
        page.Should().Be(2);
        pageSize.Should().Be(10);
    }

    [Fact]
    public async Task GetTickets_FilterByPriority()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var dept = db.Departments.First();
            var customer = db.Customers.First();
            db.Tickets.Add(new Ticket
            {
                Number = Ticket.GenerateTicketNumber(),
                Subject = "PriorityTest",
                Description = "Desc",
                Priority = TicketPriority.Urgent,
                DepartmentId = dept.Id,
                CustomerId = customer.Id,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            });
            db.SaveChanges();
        }

        var resp = await client.GetAsync("/api/tickets?priority=" + (int)TicketPriority.Urgent);
        resp.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await resp.Content.ReadFromJsonAsync<dynamic>();
        int total = json!.data.total;
        total.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task GetTickets_FilterCombined_StatusAndQuery()
    {
        var client = _factory.CreateClient();
        var token = await GetAuthTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var dept = db.Departments.First();
            var customer = db.Customers.First();
            db.Tickets.Add(new Ticket
            {
                Number = Ticket.GenerateTicketNumber(),
                Subject = "ComboMatch",
                Description = "Desc",
                Priority = TicketPriority.Normal,
                DepartmentId = dept.Id,
                CustomerId = customer.Id,
                Status = TicketStatus.InProgress,
                CreatedAt = DateTime.UtcNow
            });
            db.Tickets.Add(new Ticket
            {
                Number = Ticket.GenerateTicketNumber(),
                Subject = "Other",
                Description = "Desc",
                Priority = TicketPriority.Normal,
                DepartmentId = dept.Id,
                CustomerId = customer.Id,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            });
            db.SaveChanges();
        }

        var resp = await client.GetAsync($"/api/tickets?status={(int)TicketStatus.InProgress}&q=ComboMatch");
        resp.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await resp.Content.ReadFromJsonAsync<dynamic>();
        int total = json!.data.total;
        total.Should().Be(1);
    }
}
