﻿using Algorithm.KShortestPaths.Models;
using Core.Models;
using System;

namespace Algorithm.KShortestPaths
{
    public static class GraphExtension
    {
        /// <summary>
        /// Create direactional edge base on ticket price
        /// </summary>
        /// <param name="graph">Object to be added vertex and edge</param>
        /// <param name="ticket">Ticket that is used for evaluation</param>
        /// <remarks>Departure and arrival will be translate into 2 vertex</remarks>
        public static void CreateEdgeFromTicketBaseOnPrice(this EppsteinGraph graph, Ticket ticket)
        {
            //Get Departure vertex
            //Vertex departureVertex = graph.GetVertex(ticket.DepartureStationId, ticket.DepartureDateTime);
            Vertex departureVertex = graph.GetVertex(ticket.DepartureStation.City.Id, ticket.DepartureDateTimeUTC);
            if(departureVertex == null)
            {
                departureVertex = new Vertex(ticket.DepartureStation.City.Id, ticket.DepartureDateTimeUTC);
                graph.AddVertex(departureVertex);
            }

            //Get arrival vertex
            Vertex arrivalVertex = graph.GetVertex(ticket.ArrivalStation.City.Id, ticket.ArrivalDateTimeUTC);
            if(arrivalVertex == null)
            {
                arrivalVertex = new Vertex(ticket.ArrivalStation.City.Id, ticket.ArrivalDateTimeUTC);
                graph.AddVertex(arrivalVertex);
            }

            Edge edge = new Edge(departureVertex, arrivalVertex, Convert.ToDouble(ticket.SellingPrice), EdgeType.Traveling, ticket);
            departureVertex.RelatedEdges.Add(edge);
            if(edge.Head != edge.Tail) // avoid duplicate edge when meet self-pointing edge
            {
                arrivalVertex.RelatedEdges.Add(edge);
            }
        }

        /// <summary>
        /// Create direactional edge base on ticket traveling time
        /// </summary>
        /// <param name="graph">Object to be added vertex and edge</param>
        /// <param name="ticket">Ticket that is used for evaluation</param>
        /// <remarks>Departure and arrival will be translate into 2 vertex</remarks>
        public static void CreateEdgeFromTicketBaseOnTravelingTime(this EppsteinGraph graph, Ticket ticket)
        {
            //Get Departure vertex
            //Vertex departureVertex = graph.GetVertex(ticket.DepartureStationId, ticket.DepartureDateTime);
            Vertex departureVertex = graph.GetVertex(ticket.DepartureStation.City.Id, ticket.DepartureDateTimeUTC);
            if (departureVertex == null)
            {
                departureVertex = new Vertex(ticket.DepartureStation.City.Id, ticket.DepartureDateTimeUTC);
                graph.AddVertex(departureVertex);
            }

            //Get arrival vertex
            Vertex arrivalVertex = graph.GetVertex(ticket.ArrivalStation.City.Id, ticket.ArrivalDateTimeUTC);
            if (arrivalVertex == null)
            {
                arrivalVertex = new Vertex(ticket.ArrivalStation.City.Id, ticket.ArrivalDateTimeUTC);
                graph.AddVertex(arrivalVertex);
            }

            Edge edge = new Edge(departureVertex, arrivalVertex, ticket.ArrivalDateTimeUTC.Subtract(ticket.DepartureDateTimeUTC).TotalMilliseconds, EdgeType.Traveling, ticket);
            departureVertex.RelatedEdges.Add(edge);
            if (edge.Head != edge.Tail) // avoid duplicate edge when meet self-pointing edge
            {
                arrivalVertex.RelatedEdges.Add(edge);
            }
        }

        /// <summary>
        /// Create direactional edge base on ticket arrival date
        /// </summary>
        /// <param name="graph">Object to be added vertex and edge</param>
        /// <param name="ticket">Ticket that is used for evaluation</param>
        /// <remarks>Departure and arrival will be translate into 2 vertex</remarks>
        public static void CreateEdgeFromTicketBaseOnArrivalDate(this EppsteinGraph graph, Ticket ticket)
        {
            //Get Departure vertex
            //Vertex departureVertex = graph.GetVertex(ticket.DepartureStationId, ticket.DepartureDateTime);
            Vertex departureVertex = graph.GetVertex(ticket.DepartureStation.City.Id, ticket.DepartureDateTimeUTC);
            if (departureVertex == null)
            {
                departureVertex = new Vertex(ticket.DepartureStation.City.Id, ticket.DepartureDateTimeUTC);
                graph.AddVertex(departureVertex);
            }

            //Get arrival vertex
            Vertex arrivalVertex = graph.GetVertex(ticket.ArrivalStation.City.Id, ticket.ArrivalDateTimeUTC);
            if (arrivalVertex == null)
            {
                arrivalVertex = new Vertex(ticket.ArrivalStation.City.Id, ticket.ArrivalDateTimeUTC);
                graph.AddVertex(arrivalVertex);
            }

            Edge edge = new Edge(departureVertex, arrivalVertex, ticket.ArrivalDateTimeUTC.Subtract(ticket.DepartureDateTimeUTC).TotalMilliseconds, EdgeType.Traveling, ticket);
            departureVertex.RelatedEdges.Add(edge);
            if (edge.Head != edge.Tail) // avoid duplicate edge when meet self-pointing edge
            {
                arrivalVertex.RelatedEdges.Add(edge);
            }
        }
    }
}
