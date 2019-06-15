using System.Collections.Generic;

namespace Algorithm.KShortestPaths.Models
{
    /// <summary>
    /// Vertex of Graph
    /// </summary>
    public class Vertex
    {
        public Vertex(int id, object ObjectValue)
        {
            this.Id = id;
            this.Data = ObjectValue;
            this.RelatedEdges = new List<Edge>();
        }

        /// <summary>
        /// Data
        /// </summary>
        public object Data { get; set; }
        
        /// <summary>
        /// Id of this Vertex
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Related Edges of this Vertex. Available after calculate shortest path.
        /// </summary>
        public List<Edge> RelatedEdges { get; set; }

        /// <summary>
        /// Min distance to destination. Available after calculate shortest path.
        /// </summary>
        public double MinDistance { get; set; }

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
                return this.Id == (obj as Vertex).Id;
            }
            return false;
        }

        /// <summary>
        /// Return a has for this Object
        /// </summary>
        /// <returns>Hash Calculated for this object</returns>
        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}
