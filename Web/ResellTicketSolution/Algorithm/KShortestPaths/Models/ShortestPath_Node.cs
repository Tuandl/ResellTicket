using System;

namespace Algorithm.KShortestPaths.Models
{
    public class ShortestPath_Node : IComparable
    {
        public Edge Edge { get; set; }

        public double Weight { get; set; }

        public ShortestPath_Node(
            Edge edge, double weight)
        {
            Edge = edge;
            Weight = weight;
        }

        /// <summary>
        /// Compare 2 Shortest Path Node by its weight value
        /// </summary>
        /// <param name="obj">Object to compare with</param>
        /// <returns>-1 if this is shorter than obj. 0 if this is equal with obj. 1 if this is longer than obj.</returns>
        /// <exception cref="Exception">Throw when obj is not ShortestPath_Node type</exception>
        public int CompareTo(object obj)
        {
            return Math.Sign(this.Weight - ((ShortestPath_Node)obj).Weight);
        }
    }
}
