using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Enum
{
    public enum ResolveOption
    {
        /// <summary>
        /// replace vé rename fail bằng vé khác
        /// </summary>
        REPLACE = 1,

        /// <summary>
        /// refund tiền vé fail cho buyer
        /// </summary>
        REFUNDFAILTICKET = 2,

        /// <summary>
        /// refund toàn bộ số tiền của route đó cho buyer
        /// </summary>
        REFUNDTOTALAMOUNT = 3,
    }
}
