using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace Controllers
{
    [Authorize]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    [Produces("application/json")]
    [Route("api/v1/Auth")]
    public class AuthController : Controller
    {
        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] TokenRequest request)
        {
            // TODO: gestire logica di validazione utente
            var user = fakeValidateUser(request.Username);
            //if (user == null)
            //    return NotFound("Invalid username or password");

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(generateToken(user))
            });
        }

        [HttpGet]
        [Route("user")]
        public IActionResult LoggedUser()
        {
            var user = fakeValidateUser(base.User.Identity.Name);
            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                data = user
            });
        }

        [HttpGet]
        [Route("refresh")]
        public IActionResult Refresh()
        {
            var user = fakeValidateUser(base.User.Identity.Name);
            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(generateToken(user))
            });
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("register")]
        public IActionResult Register([FromBody]UserRegistrationDto userToRegister)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = fakeRegisterUser(userToRegister);

            if (user == null)
                return NotFound("Registration error");

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(generateToken(user))
            });
        }

        private User fakeRegisterUser(UserRegistrationDto userToRegister)
        {
            var user = fakeValidateUser(userToRegister?.UserName);

            if (user != null)
            {
                user.FirstName = userToRegister.FirstName;
                user.LastName = userToRegister.LastName;
            }

            return user;
        }

        private User fakeValidateUser(string username)
        {
            if(string.IsNullOrWhiteSpace(username?.Trim()))
                return null;

            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = username,
                FirstName = "Pinco",
                LastName = "Pallinoski",
                Roles = new List<string>()
            };

            if ((username?.ToLower().Contains("admin")).GetValueOrDefault())
            {
                user.Roles.Add("Admin");
            }

            return user;
        }

        private SecurityToken generateToken(User user)
        {
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.UserName) };
            user.Roles?.ForEach(role => claims.Add(new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("wjhecbgjyegcnrjgcavdzken")); // _configuration["SecurityKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "my-spa-demo.com",
                audience: "my-spa-demo.com",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return token;
        }

        public class TokenRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        public class User
        {
            public Guid Id { get; set; }
            public string UserName { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public List<string> Roles { get; set; }
        }

        public class UserRegistrationDto
        {
            public string UserName { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Password { get; set; }
        }
    }
}
