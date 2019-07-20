using System.Collections.Generic;
using System.Linq;

namespace Algorithm.KShortestPaths.Models
{
    /// <summary>
    /// Contains Edges
    /// </summary>
    public class Path : List<Edge>
    {
        /// <summary>
        /// Path is valid only when path contain one or more Edges
        /// </summary>
        public bool IsValid { 
            get => this.Count > 0; 
        }

        /// <summary>
        /// Calculate Weight of this path
        /// Weight of this path equal sum weight of all edges
        /// </summary>
        public double Weight { 
            get { 
                double totalWeight = 0;
                foreach (var edge in this)
                {
                    totalWeight += edge.Weight;
                }
                return totalWeight;
            }
        }

        /// <summary>
        /// Return sum of all delta weight of this path
        /// </summary>
        public double DeltaWeight { 
            get {
                double totalWeight = 0;
                foreach (var edge in this)
                {
                    totalWeight += edge.DeltaWeight;
                }
                return totalWeight;
            } 
        }

        /// <summary>
        /// Get Ticket quantity in this path (base on edge)
        /// </summary>
        public int TicketQuantity
        {
            get
            {
                int ticketQuantity = 0;
                foreach (var edge in this)
                {
                    if(edge.Type == EdgeType.Traveling) 
                        ticketQuantity++;
                }
                return ticketQuantity;
            }
        }

        public Path Trim()
        {
            Path result = new Path();
            foreach (var edge in this)
            {
                if(edge.Type == EdgeType.Traveling)
                {
                    result.Add(edge);
                }
            }
            return result;
        }

        public override string ToString()
        {
            var result = string.Empty;
            foreach (var edge in this)
            {
                result += edge.ToString() + "; ";
            }
            result += $"Weight = {Weight}; DeltaWeight = {DeltaWeight}";
            return result;
        }

        /// <summary>
        /// Get all vertices in this path
        /// </summary>
        /// <returns></returns>
        public List<Vertex> GetAllVertices()
        {
            var vertices = new List<Vertex>();

            if(this.Count > 0)
            {
                vertices.Add(this.FirstOrDefault().Tail);

                foreach (var edge in this)
                {
                    vertices.Add(edge.Head);
                }
            }

            return vertices;
        }
    }
}
