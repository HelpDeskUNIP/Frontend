using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSystem.API.Data;
using TicketSystem.API.Models.Entities;
using TicketSystem.API.Models.Enums;
using TicketSystem.API.Models.DTOs;
using TicketSystem.API.Services.Interfaces;
using AutoMapper;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public UsersController(ApplicationDbContext context, IAuthService authService, IMapper mapper)
        {
            _context = context;
            _authService = authService;
            _mapper = mapper;
        }

        // Admin pode criar agentes e administradores
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Verificar email
            if (_context.Set<User>().Any(u => u.Email == dto.Email))
                return BadRequest(new { Message = "Email já em uso" });

            User user;
            if (dto.UserType == UserType.Agent)
            {
                user = new Agent
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    IsActive = true
                };
            }
            else if (dto.UserType == UserType.Admin)
            {
                user = new Admin
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    IsActive = true
                };
            }
            else
            {
                return BadRequest(new { Message = "Tipo de usuário inválido para esse endpoint" });
            }

            _context.Set<User>().Add(user);
            await _context.SaveChangesAsync();

            var userDto = _mapper.Map<UserDto>(user);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new { Message = "Usuário criado", Data = userDto });
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _authService.GetUserByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuário não encontrado" });
            return Ok(new { Message = "Usuário obtido", Data = user });
        }
    }

    // DTO local para criar usuário via admin
    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public UserType UserType { get; set; } = UserType.Agent;
    }
}
