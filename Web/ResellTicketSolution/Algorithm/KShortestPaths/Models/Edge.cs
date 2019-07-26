using System.Globalization;

namespace Algorithm.KShortestPaths.Models
{
    /// <summary>
    /// Contain Directional Edge
    /// </summary>
    public class Edge
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="tail"></param>
        /// <param name="head"></param>
        /// <param name="weight"></param>
        /// <param name="data"></param>
        public Edge(Vertex tail, Vertex head, double weight, EdgeType type, object data)
        {
            this.Tail = tail;
            this.Head = head;
            this.Weight = weight;
            this.Type = type;
            this.Data = data;
        }

        /// <summary>
        /// Ticket
        /// </summary>
        public object Data { get; set; }

        /// <summary>
        /// Public Getter for Tail Vertex. Tail is departure
        /// </summary>
        public Vertex Tail { get; }

        /// <summary>
        /// Public Getter for Head Vertex. Head is arrival
        /// </summary>
        public Vertex Head { get; }

        /// <summary>
        /// Weight of Edge
        /// </summary>
        public double Weight { get; set; }

        /// <summary>
        /// Type of this Edge
        /// </summary>
        /// <remarks>Type can be Waiting edge or Traveling Edge</remarks>
        public EdgeType Type { get; set; }

        /// <summary>
        /// Returns the side track deltaWeight 
        /// Only valid when shortest path is already calculated
        /// </summary>
        public double DeltaWeight { 
            get
            {
                return this.Head.MinDistance - this.Tail.MinDistance + this.Weight;
            }    
        }

        /// <summary>
        /// Check whether this edge is a sidetrack of specific vertex
        /// </summary>
        /// <param name="v">Vertex to evaluate</param>
        /// <returns>True if this edge is sidetrack of v. False if not.</returns>
        public bool IsSideTrackOf(Vertex v)
        {
            return this.Tail == v && v.EdgeToShortestPath != this;
        }

        public override string ToString()
        {
            return $"{Tail.GroupId} {Tail.ArrivalTimeUTC} --> {Head.GroupId} {Head.ArrivalTimeUTC} ({Weight.ToString("C0")})";
        }
    }
}
