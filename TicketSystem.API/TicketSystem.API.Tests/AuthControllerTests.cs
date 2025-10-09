using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace TicketSystem.API.Tests;

public class AuthControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AuthControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task POST_auth_login_invalid_credentials_returns_unauthorized_or_badrequest()
    {
        var client = _factory.CreateClient();
        var payload = new { email = "fake@invalid.com", password = "wrong" }; // adjust to match controller expectation
        var response = await client.PostAsJsonAsync("/auth/login", payload);
        response.StatusCode.Should().BeOneOf(HttpStatusCode.Unauthorized, HttpStatusCode.BadRequest);
    }
}
