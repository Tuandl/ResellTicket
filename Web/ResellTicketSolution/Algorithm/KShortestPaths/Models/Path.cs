using System.Collections.Generic;

namespace Algorithm.KShortestPaths.Models
{
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


    }
}
