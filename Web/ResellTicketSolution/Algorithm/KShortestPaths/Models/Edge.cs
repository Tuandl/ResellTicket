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
        public Edge(Vertex tail, Vertex head, double weight)
        {
            this.Tail = tail;
            this.Head = head;
            this.Weight = weight;
        }

        /// <summary>
        /// Public Getter for Tail Vertex
        /// </summary>
        public Vertex Tail { get; }

        /// <summary>
        /// Public Getter for Head Vertex
        /// </summary>
        public Vertex Head { get; }

        /// <summary>
        /// Weight of Edge
        /// </summary>
        public double Weight { get; set; }
    }
}
