using Core.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ViewModel.AppSetting;

namespace WebAPI.Admin.Configuration.Authorization
{
    public static class JwtTokenBuilder
    {
        public static string BuildToken(this User user, AuthSetting authSetting)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authSetting.Secret));
            var crediential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: authSetting.Issuer,
                audience: authSetting.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(authSetting.AccessExpiration),
                signingCredentials: crediential
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
