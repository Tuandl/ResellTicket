﻿using Algorithm.KShortestPaths.Models;
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
        /// Number of K shortest path
        /// </summary>
        private int KShortestPathQuantity= 0;

        /// <summary>
        /// Maximum node in final path
        /// </summary>
        private int MaxCombination = int.MaxValue;

        /// <summary>
        /// Max Waiting hours between 2 tickets in a route
        /// </summary>
        private int MaxWaitingBetweenTwoTickets = 24;

        /// <summary>
        /// Min Waiting hours between 2 tickets in a route
        /// </summary>
        private int MinWaitingBetweenTwoTickets = 1;

        /// <summary>
        /// Is order by arrival Date
        /// </summary>
        private bool IsBasedOnArrivalDate = false;

        /// <summary>
        /// Is order by total traveling time
        /// </summary>
        private bool IsBasedOnTravelingTime = false;

        /// <summary>
        /// Constructor
        /// </summary>
        public EppsteinGraph()
        {
            isCaculated = false;
            vertices = new List<Vertex>();
        }

        /// <summary>
        /// Create custome graph to find k shortest paths with schedule-base criterial
        /// </summary>
        /// <param name="departureId"></param>
        /// <param name="destinationId"></param>
        private void InitSourceDestination(int departureId, int destinationId)
        {
            //Source vertex is the earliest departure node
            SourceVertex = this.vertices.Where(x => x.GroupId == departureId)
                .OrderBy(x => x.ArrivalTimeUTC)
                .FirstOrDefault();
            if(SourceVertex == null) throw new Exception("Not found Source Vertex.");

            //Destination vertex is the latest destination node
            DestinationVertex = this.vertices.Where(x => x.GroupId == destinationId) 
                .OrderByDescending(x => x.ArrivalTimeUTC)
                .FirstOrDefault();
            if(DestinationVertex == null) throw new Exception("Not found Destination Vertex.");

            this.vertices = this.vertices.OrderBy(x => x.GroupId).ThenBy(x => x.ArrivalTimeUTC).ToList();

            //Connect the vertices in a group
            for(int i = 0; i < vertices.Count() - 1; i++)
            {
                var currentVertex = vertices[i];
                var nextVertex = vertices[i+1];
                if(currentVertex.GroupId == nextVertex.GroupId)
                {
                    double weight = 0;

                    // if order by arrival date 
                    // we must add weight into waiting edges in cities, except destination city
                    if(IsBasedOnArrivalDate && currentVertex.GroupId != destinationId)
                    {
                        weight = nextVertex.ArrivalTimeUTC.Subtract(currentVertex.ArrivalTimeUTC).TotalMilliseconds;
                    }

                    // If order by total traveling time
                    // we must add weight into waiting edges in cities, except departure city and destination city
                    if(IsBasedOnTravelingTime && currentVertex.GroupId != departureId && currentVertex.GroupId != destinationId)
                    {
                        weight = nextVertex.ArrivalTimeUTC.Subtract(currentVertex.ArrivalTimeUTC).TotalMilliseconds;
                    }

                    var edge = new Edge(currentVertex, nextVertex, weight, EdgeType.Waiting, null);
                    currentVertex.RelatedEdges.Add(edge);
                    nextVertex.RelatedEdges.Add(edge);
                }
            }

            this.vertices.Add(SourceVertex);
            this.vertices.Add(DestinationVertex);
        }

        /// <summary>
        /// Calculate graph for getting paths later
        /// </summary>
        /// <param name="departureId">Soruce vertex Id</param>
        /// <param name="destinationId">Destination vertex Id</param>
        /// <param name="maxCombination">Maximum Travel Edges</param>
        /// <param name="kshortestPathQuantity">Precalculate only k shotest paths</param>
        /// <param name="maxWaitingHours">Find Routes that has 2 near tickets' waiting time less than or equal this hour. Default is 1 day.</param>
        public void BuildKthShortestPaths(int departureId, int destinationId, int maxCombination = int.MaxValue, int kshortestPathQuantity = 10,
            int maxWaitingHours = 24, bool isBasedOnArrivalDate = false, bool isBasedOnTravelingTime = false)
        {
            isCaculated = false;
            this.IsBasedOnArrivalDate = isBasedOnArrivalDate;
            this.IsBasedOnTravelingTime = isBasedOnTravelingTime;

            //Parse start and end vertex
            InitSourceDestination(departureId, destinationId);
            this.MaxCombination = maxCombination;
            this.KShortestPathQuantity = kshortestPathQuantity;
            this.MaxWaitingBetweenTwoTickets = maxWaitingHours;

            if (SourceVertex == null || DestinationVertex == null)
            {
                throw new InvalidOperationException("Invalid Source or destination");
            }

            // Builds shortest path tree for all vertices to destination, according to Dijkstra,
            // storing distance to endpoint information on vertices, as described in Eppstein
            BuildShortestPathTree();

            // Fills a heap with all possible tracks from source to destination, as described in Eppstein
            // Paths are defined uniquely by sidetrack collections (edges not in shortest paths) 
            BuildSidetracksHeapV2();

            // Flag to indicate that shortest paths have been calculated
            isCaculated = true;
        }

        /// <summary>
        /// Calculate All the shortest paths between sources and destination and return one 
        /// </summary>
        /// <param name="departureId">Source vertex Id</param>
        /// <param name="destinationId">Destination vertex Id</param>
        /// <returns>Directional paths if found, empty path if not or id of vertex is invalid.</returns>
        public Path FindTheShortestPath(int departureId, int destinationId, int maxCombination = int.MaxValue, int kShortestPathQuantity = 10)
        {
            isCaculated = false;

            //Parse start and end vertex
            InitSourceDestination(departureId, destinationId);
            this.MaxCombination = maxCombination;
            this.KShortestPathQuantity = kShortestPathQuantity;

            if(SourceVertex == null || DestinationVertex == null)
            {
                throw new InvalidOperationException("Invalid Source or destination");
            }

            // Builds shortest path tree for all vertices to destination, according to Dijkstra,
            // storing distance to endpoint information on vertices, as described in Eppstein
            BuildShortestPathTree();

            // Fills a heap with all possible tracks from source to destination, as described in Eppstein
            // Paths are defined uniquely by sidetrack collections (edges not in shortest paths) 
            BuildSidetracksHeapV2();

            // Flag to indicate that shortest paths have been calculated
            isCaculated = true;

            return FindNextShortestPath();
        }

        public Vertex GetVertex(int departureId, DateTime arrivalTime)
        {
            return vertices.FirstOrDefault(x =>
                x.GroupId == departureId && 
                x.ArrivalTimeUTC == arrivalTime
            );
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
                        int ticketQuantity = v.TicketQuantity;
                        if(edge.Type == EdgeType.Traveling) ticketQuantity++;
                        //Excluse negative edges
                        if(edge.Tail != v && edge.Weight >= 0 && ticketQuantity <= this.MaxCombination) 
                            priorityQueue.Enqueue(new ShortestPath_Node(edge, edge.Weight + v.MinDistance));
                    }
                }

                var shortestNode = priorityQueue.Dequeue(); // Extracts next element in queue
                if (shortestNode == null)
                    break; //No pending node to evaluate

                Edge e = shortestNode.Edge;
                v = e.Tail;
                if(v.MinDistance == double.MinValue)  // Vertex distance to endpoint not calculated yet
                {
                    v.MinDistance = e.Head.MinDistance + e.Weight;
                    v.TicketQuantity = e.Head.TicketQuantity;
                    if(e.Type == EdgeType.Traveling)
                    {
                        v.TicketQuantity++;
                    }
                    v.EdgeToShortestPath = e;
                }
                else
                    v = null;

                //if(priorityQueue.Count() == 0)
                //    break;
            } while (true);
        }

        /// <summary>
        /// Create sidetrack using BFS
        /// </summary>
        private void BuildSidetracksHeapV2()
        {
            SideTrackPathsHeap = new PriorityQueue<SideTrack_Node>();
            var priorityQueue = new PriorityQueue<SideTrack_Node>();

            Path emptyPath = new Path();
            priorityQueue.Enqueue(new SideTrack_Node(emptyPath, SourceVertex));

            //Only stop looping when queue is empty or have not found kth shortest path
            while (priorityQueue.Count() > 0 && SideTrackPathsHeap.Count() < KShortestPathQuantity)
            {
                var currentSideTrack = priorityQueue.Dequeue();
                if(currentSideTrack.SideTrack.TicketQuantity + currentSideTrack.CurrentVertex.TicketQuantity > this.MaxCombination)
                {
                    continue;
                }

                //Check duplicate path result
                //bool isExisted = false;
                //var currentFullPath = RebuildPath(currentSideTrack.SideTrack).Trim();
                //foreach (var node in SideTrackPathsHeap.data)
                //{
                //    var nodeFullPath = RebuildPath(node.SideTrack).Trim();
                //    if(currentFullPath.ToString() == nodeFullPath.ToString())
                //    {
                //        isExisted = true;
                //        break;
                //    }
                //}

                //if(!isExisted)
                //{
                //    SideTrackPathsHeap.Enqueue(currentSideTrack);
                //}

                //Check max waiting hours before add into result
                var currentFullPath = RebuildPath(currentSideTrack.SideTrack).Trim();
                if(currentFullPath.GetMaximumWaitingHour() <= this.MaxWaitingBetweenTwoTickets &&
                    currentFullPath.GetMinimumWaitingHour() >= this.MinWaitingBetweenTwoTickets)
                {
                    SideTrackPathsHeap.Enqueue(currentSideTrack);
                }


                //Add Path to result
                //SideTrackPathsHeap.Enqueue(currentSideTrack);

                var currentVertex = currentSideTrack.CurrentVertex;
                var currentPath = new Path();
                currentPath.AddRange(currentSideTrack.SideTrack);

                while(currentVertex.EdgeToShortestPath != null && currentVertex != DestinationVertex)
                {
                    //Search sidetrack in current vertex
                    foreach (var edge in currentVertex.RelatedEdges)
                    {
                        if(edge.IsSideTrackOf(currentVertex) && (edge.Head.EdgeToShortestPath != null || edge.Head == this.DestinationVertex))
                        {
                            //If found a side track, put it into queue
                            var nextSideTrack = new Path();
                            nextSideTrack.AddRange(currentPath);
                            nextSideTrack.Add(edge);
                            priorityQueue.Enqueue(new SideTrack_Node(nextSideTrack, edge.Head));
                        }
                    }

                    //Move to next vertex in shortest path
                    currentPath.Add(currentVertex.EdgeToShortestPath);
                    currentVertex = currentVertex.EdgeToShortestPath.Head;
                }
            }
        }

        /// <summary>
        /// Create all possible paths
        /// </summary>
        private void BuildSidetracksHeap()
        {
            SideTrackPathsHeap = new PriorityQueue<SideTrack_Node>();
            Path emptyPath = new Path();
            this.SideTrackPathsHeap.Enqueue(new SideTrack_Node(emptyPath, null));
            AddSideTracks(emptyPath, SourceVertex);
        }

        /// <summary>
        /// Add SideTrack using DFS 
        /// </summary>
        /// <param name="currentPath">Previous sidetrack collection</param>
        /// <param name="currentVertex">Vertex to evaluate</param>
        /// <remarks>This will not work with graph contains circle</remarks>
        private void AddSideTracks(Path currentPath, Vertex currentVertex)
        {
            //TODO: Add filter max combination
            foreach (var edge in currentVertex.RelatedEdges)
            {
                if(edge.IsSideTrackOf(currentVertex) && (edge.Head.EdgeToShortestPath != null || edge.Head == this.DestinationVertex))
                {
                    Path nextSideTrackPath = new Path();
                    nextSideTrackPath.AddRange(currentPath);
                    nextSideTrackPath.Add(edge);
                    this.SideTrackPathsHeap.Enqueue(new SideTrack_Node(nextSideTrackPath, null));

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

        /// <summary>
        /// Add vertex into this graph
        /// </summary>
        /// <param name="newVertex"></param>
        public void AddVertex(Vertex newVertex)
        {
            var existedVertex = this.GetVertex(newVertex.GroupId, newVertex.ArrivalTimeUTC);
            if(existedVertex != null)
            {
                //Don't allow to add duplicate vertex id
                return;
            }

            //Flag graph must rebuild
            isCaculated = false;
            this.vertices.Add(newVertex);
        }

        public override string ToString()
        {
            var result = string.Empty;
            List<Edge> edges = new List<Edge>();
            foreach (var vertex in vertices)
            {
                foreach (var edge in vertex.RelatedEdges)
                {
                    var existed = edges.FirstOrDefault(x => 
                        x.Tail.Equals(edge.Tail) &&
                        x.Head.Equals(edge.Head) &&
                        x.Weight == edge.Weight
                    );
                    if(existed == null)
                    {
                        edges.Add(edge);
                    }
                }
            }

            foreach (var edge in edges)
            {
                result += edge.ToString() + "\n";
            }

            return result;
        }
    }
}
