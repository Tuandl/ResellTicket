using Core.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ViewModel.AppSetting;

namespace WebAPI.Admin.Configuration.Authorization
{
    public static class JwtTokenBuilder
    {
        public static string BuildToken(this User user, AuthSetting authSetting, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                //Jti: JTW token id là 1 unique id, đảm bảo cái token ko bị ăn cắp 
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName)
            }; //payload

            claims.AddRange(roles.Select(role => new Claim(ClaimsIdentity.DefaultRoleClaimType, role)));
            //Chuyển chuỗi authSetting.Secret thành 1 mảng bytes rồi encoding(mã hóa) nó theo chuẩn UTF8
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authSetting.Secret)); //where header?

            var crediential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); //signature?
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
