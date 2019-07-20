using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Enum
{
    public enum TicketStatus
    {
        /// <summary>
        /// trạng thái lúc post vé lên
        /// </summary>
        Pending = 1,

        /// <summary>
        /// trạng thái sau khi staff duyệt vé hợp lệ
        /// hoặc khi người bán từ chổi đổi tên
        /// </summary>
        Valid = 2,

        /// <summary>
        /// trạng thái sau khi staff duyệt vé không hợp lệ
        /// </summary>
        Invalid = 3,

        /// <summary>
        /// trạng thái khi có người mua vé
        /// </summary>
        Bought = 4,

        /// <summary>
        /// trạng thái khi người bán thông báo đã đổi tên
        /// </summary>
        Renamed = 5,

        /// <summary>
        /// trạng thái khi staff xác nhận đã đổi tên thành công
        /// </summary>
        Completed = 6,

        RenamedSuccess = 7,
        RenamedFail = 8

        /// <summary>
        /// trạng thái khi người bán từ chối đổi tên
        /// </summary>
        ///Refused = 6

    }
}
