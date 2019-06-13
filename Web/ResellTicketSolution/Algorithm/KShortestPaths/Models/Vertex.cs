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
        /// Related Edges of this Vertex
        /// </summary>
        public List<Edge> RelatedEdges { get; set; }

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
