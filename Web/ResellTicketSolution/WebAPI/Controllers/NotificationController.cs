using Microsoft.AspNetCore.Mvc;
using Service.Services;
using System;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(
                INotificationService notificationService
            )
        {
            _notificationService = notificationService;
        }

        /// <summary>
        /// Get list notification for this user with pagination
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("data-table")]
        public IActionResult GetDataTable(int page, int pageSize)
        {
            try
            {
                var notifications = _notificationService.GetNotificationDataTable(User.Identity.Name, page, pageSize);
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetBaseException().Message);
            }
        }

        /// <summary>
        /// Update notification: read = true in database
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("{id}/read")]
        public IActionResult ReadNotification(int id)
        {
            try
            {
                _notificationService.ReadNotification(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetBaseException().Message);
            }
        }

        /// <summary>
        /// Count unread notification for this user
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("unread")]
        public IActionResult CountUnreadNotification()
        {
            try
            {
                var result = _notificationService.CountUnreadNotifications(User.Identity.Name);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetBaseException().Message);
            }
        }
    }
}