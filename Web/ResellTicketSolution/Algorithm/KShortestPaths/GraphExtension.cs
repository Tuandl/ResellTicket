using Algorithm.KShortestPaths.Models;
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
            Vertex departureVertex = graph.GetVertex(ticket.DepartureStationId, ticket.DepartureDateTime);
            if(departureVertex == null)
            {
                departureVertex = new Vertex(ticket.DepartureStationId, ticket.DepartureDateTime, ticket);
                graph.AddVertex(departureVertex);
            }

            //Get arrival vertex
            Vertex arrivalVertex = graph.GetVertex(ticket.ArrivalStationId, ticket.ArrivalDateTime);
            if(arrivalVertex == null)
            {
                arrivalVertex = new Vertex(ticket.ArrivalStationId, ticket.ArrivalDateTime, ticket);
                graph.AddVertex(arrivalVertex);
            }

            Edge edge = new Edge(departureVertex, arrivalVertex, Convert.ToDouble(ticket.SellingPrice), EdgeType.Traveling);
            departureVertex.RelatedEdges.Add(edge);
            if(edge.Head != edge.Tail) // avoid duplicate edge when meet self-pointing edge
            {
                arrivalVertex.RelatedEdges.Add(edge);
            }
        }
    }
}
