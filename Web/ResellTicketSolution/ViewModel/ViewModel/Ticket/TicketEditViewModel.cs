using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ViewModel.ViewModel.Ticket
{
    public class TicketEditViewModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string TicketCode { get; set; }

        [Required]
        public int TransportationId { get; set; }

        [Required]
        public int DepartureStationId { get; set; }

        [Required]
        public int ArrivalStationId { get; set; }

        [Required]
        public decimal SellingPrice { get; set; }
        public string Description { get; set; }

        [Required]
        public DateTime DepartureDateTime { get; set; }

        [Required]
        public DateTime ArrivalDateTime { get; set; }

        [Required]
        public int TicketTypeId { get; set; }
    }
}
