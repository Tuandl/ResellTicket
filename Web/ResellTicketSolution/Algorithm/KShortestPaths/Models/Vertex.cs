using System;
using System.Collections.Generic;

namespace Algorithm.KShortestPaths.Models
{
    /// <summary>
    /// Vertex of Graph
    /// </summary>
    public class Vertex
    {
        public Vertex(int groupId, DateTime arrivalTime)
        {
            this.GroupId = groupId;
            this.ArrivalTime = arrivalTime;
            this.RelatedEdges = new List<Edge>();
        }

        /// <summary>
        /// Group by Departure Id
        /// </summary>
        public int GroupId { get; set; }

        /// <summary>
        /// Arrival time of this vertex
        /// </summary>
        public DateTime ArrivalTime { get; set; }

        /// <summary>
        /// Related Edges of this Vertex. Available after calculate shortest path.
        /// </summary>
        public List<Edge> RelatedEdges { get; set; }

        /// <summary>
        /// Min distance to destination. Available after calculate shortest path.
        /// </summary>
        public double MinDistance { get; set; }

        /// <summary>
        /// Number of tickets from this vertex to destination in the shortest path.
        /// </summary>
        public int TicketQuantity { get; set; }

        /// <summary>
        /// Edge belong to shortest path from this vertex to destination
        /// </summary>
        public Edge EdgeToShortestPath { get; set; }

        /// <summary>
        /// Next Vertex in shortest path
        /// </summary>
        public Vertex NextVertexInShortestPath { 
            get
            {
                if(EdgeToShortestPath == null) return null;
                return EdgeToShortestPath.Head;
            }    
        }

        /// <summary>
        /// Comparation between 2 Vertex
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>True if 2 Vertex has the same Id.</returns>
        public override bool Equals(object obj)
        {
            if(obj is Vertex)
            {
                return this.GroupId == (obj as Vertex).GroupId && 
                    this.ArrivalTime == (obj as Vertex).ArrivalTime;
            }
            return false;
        }

        /// <summary>
        /// Return a has for this Object
        /// </summary>
        /// <returns>Hash Calculated for this object</returns>
        public override int GetHashCode()
        {
            return GroupId.GetHashCode() ^ ArrivalTime.GetHashCode();
        }


        /// <summary>
        /// Check if 2 vertexes are the same group or not
        /// </summary>
        /// <param name="anotherVertex"></param>
        /// <returns>true if 2 groups is the same.</returns>
        public bool EqualsDestination(Vertex anotherVertex)
        {
            return this.GroupId == anotherVertex.GroupId;
        }


    }
}
