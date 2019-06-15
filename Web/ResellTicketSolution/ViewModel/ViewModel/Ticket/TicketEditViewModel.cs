﻿using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Ticket
{
    public class TicketEditViewModel
    {
        public int Id { get; set; }
        public string TicketCode { get; set; }
        public int TransportationId { get; set; }
        public int DepartureStationId { get; set; }
        public int ArrivalStationId { get; set; }
        public decimal SellingPrice { get; set; }
        public string Description { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public int TicketTypeId { get; set; }
    }
}
