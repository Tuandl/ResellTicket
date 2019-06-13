using Algorithm.KShortestPaths.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Algorithm.KShortestPaths
{

    /// <summary>
    /// Contain Directed Graph
    /// </summary>
    public class EppsteinGraph
    {
        /// <summary>
        /// List of vertices in this graph
        /// </summary>
        private List<Vertex> vertices;

        /// <summary>
        /// Flag to indicate if shortest paths have been calculated
        /// </summary>
        private bool isCaculated;

        /// <summary>
        /// Source Vertex. Available after calculate shortest paths
        /// </summary>
        private Vertex SourceVertex;

        /// <summary>
        /// Destination Vertex. Available after calculate shortest paths
        /// </summary>
        private Vertex DestinationVertex;

        /// <summary>
        /// Priority Queue of side tracks in graph, ordered by total delta weight 
        /// </summary>
        private PriorityQueue<SideTrack_Node> SideTrackPathsHeap;

        /// <summary>
        /// Constructor
        /// </summary>
        public EppsteinGraph()
        {
            isCaculated = false;
            vertices = new List<Vertex>();
        }

        /// <summary>
        /// Calculate All the shortest paths between sources and destination and return one 
        /// </summary>
        /// <param name="sourceId">Source vertex Id</param>
        /// <param name="destinationId">Destination vertex Id</param>
        /// <returns>Directional paths if found, empty path if not or id of vertex is invalid.</returns>
        public Path FindTheShortestPath(int sourceId, int destinationId)
        {
            isCaculated = false;

            //Parse start and end vertex
            this.SourceVertex = GetVertex(sourceId);
            this.DestinationVertex = GetVertex(destinationId);

            if(SourceVertex == null || DestinationVertex == null)
            {
                throw new InvalidOperationException("Invalid Source or destination");
            }

            // Builds shortest path tree for all vertices to destination, according to Dijkstra,
            // storing distance to endpoint information on vertices, as described in Eppstein
            BuildShortestPathTree();

            // Fills a heap with all possible tracks from source to destination, as described in Eppstein
            // Paths are defined uniquely by sidetrack collections (edges not in shortest paths) 
            BuildSidetracksHeap();

            // Flag to indicate that shortest paths have been calculated
            isCaculated = true;

            return FindNextShortestPath();
        }

        private Vertex GetVertex(int vertexId)
        {
            return vertices.FirstOrDefault(x => x.Id == vertexId);
        }

        /// <summary>
        /// Reset graph state before finding shortest path by Dijkstra
        /// </summary>
        private void ResetGraphState()
        {
            foreach (var vertex in vertices)
            {
                vertex.EdgeToShortestPath = null;
                vertex.MinDistance = double.MinValue;
            }
        }

        /// <summary>
        /// Build the shortest path tree using a priority queue for given vertex
        /// </summary>
        /// <remarks>Negative edges are ignore.</remarks>
        private void BuildShortestPathTree()
        {
            // Reset all distances to endpoint and previous shortest path
            ResetGraphState();

            // We will start searching from the destination vertex
            Vertex v = this.DestinationVertex;
            v.MinDistance = 0;

            PriorityQueue<ShortestPath_Node> priorityQueue = new PriorityQueue<ShortestPath_Node>();

            do
            {
                if(v != null)
                {
                    foreach (var edge in v.RelatedEdges) // Evaluate all incoming edges
                    {
                        //Excluse negative edges
                        if(edge.Head == v && edge.Weight >= 0) 
                        {
                            priorityQueue.Enqueue(new ShortestPath_Node(edge, edge.Weight + v.MinDistance));
                        }
                    }
                }

                var shortestNode = priorityQueue.Dequeue(); // Extracts next element in queue
                if (shortestNode == null)
                {
                    //No pending node to evaluate
                    break;
                }

                Edge e = shortestNode.Edge;
                v = e.Tail;
                if(v.MinDistance == double.MinValue)  // Vertex distance to endpoint not calculated yet
                {
                    v.MinDistance = e.Head.MinDistance + e.Weight;
                    v.EdgeToShortestPath = e;
                }
                else
                {
                    v = null;
                }
            } while (true);
        }

        /// <summary>
        /// Create all possible paths
        /// </summary>
        private void BuildSidetracksHeap()
        {
            SideTrackPathsHeap = new PriorityQueue<SideTrack_Node>();
            Path emptyPath = new Path();
            this.SideTrackPathsHeap.Enqueue(new SideTrack_Node(emptyPath));
            AddSideTracks(emptyPath, SourceVertex);
        }

        /// <summary>
        /// Add SideTrack using DFS
        /// </summary>
        /// <param name="currentPath">Previous sidetrack collection</param>
        /// <param name="currentVertex">Vertex to evaluate</param>
        private void AddSideTracks(Path currentPath, Vertex currentVertex)
        {
            foreach (var edge in currentVertex.RelatedEdges)
            {
                if(edge.IsSideTrackOf(currentVertex) && (edge.Head.EdgeToShortestPath != null || edge.Head == this.DestinationVertex))
                {
                    Path nextSideTrackPath = new Path();
                    nextSideTrackPath.AddRange(currentPath);
                    nextSideTrackPath.Add(edge);
                    this.SideTrackPathsHeap.Enqueue(new SideTrack_Node(nextSideTrackPath));

                    if(edge.Head != currentVertex)
                    {
                        AddSideTracks(nextSideTrackPath, edge.Head);
                    }
                }
            }

            var nextVertex = currentVertex.NextVertexInShortestPath;
            if(nextVertex != null)
            {
                AddSideTracks(currentPath, nextVertex);
            }
        }

        /// <summary>
        /// Recover next pre-calculated shortest path
        /// </summary>
        /// <returns>Directional path if available, empty path if not remaining paths</returns>
        public Path FindNextShortestPath()
        {
            if (!isCaculated)
                return new Path();  // Invalid path

            // Pick next track from heap, it is ordered from shortest path to longest
            SideTrack_Node node = this.SideTrackPathsHeap.Dequeue();
            if (node == null)
                return new Path(); // Invalid path

            // Returns path reconstructed from sidetracks
            return RebuildPath(node.SideTrack);
        }

        /// <summary>
        /// Reconstructs path from sidetracks
        /// </summary>
        /// <param name="_sidetracks">Sidetracks collections for this path, could be empty for shortest</param>
        /// <returns>Full path reconstructed from source to destination, crossing sidetracks</returns>
        private Path RebuildPath(Path _sidetracks)
        {
            Path path = new Path();
            Vertex currentVertex = this.SourceVertex;
            int i = 0;

            // Start from s, following shortest path or sidetracks
            while (currentVertex != null)
            {
                // if current vertex is conected to next sidetrack, cross it
                if (i < _sidetracks.Count && _sidetracks[i].Tail == currentVertex)
                {
                    path.Add(_sidetracks[i]);
                    currentVertex = _sidetracks[i++].Head;
                }
                else // else continue walking on shortest path
                {
                    if (currentVertex.EdgeToShortestPath == null)
                        break;
                    path.Add(currentVertex.EdgeToShortestPath);
                    currentVertex = currentVertex.NextVertexInShortestPath;
                }
            }
            return path;
        }
    }
}
