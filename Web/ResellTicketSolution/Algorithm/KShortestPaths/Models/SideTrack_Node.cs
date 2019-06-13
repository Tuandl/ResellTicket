using System;
using System.Collections.Generic;
using System.Text;

namespace Algorithm.KShortestPaths.Models
{
    public class SideTrack_Node : IComparable
    {
        public Path SideTrack { get; set; }
        public double Weight { get; set; }

        public SideTrack_Node(
            Path sideTrack)
        {
            SideTrack = sideTrack;
            Weight = sideTrack.DeltaWeight;
        }

        /// <summary>
        /// Compare 2 sidetrack_node by its weight values
        /// </summary>
        /// <param name="obj">The object to compare with</param>
        /// <returns>-1 if this is less than Obj. 0 if this is equal with obj. 1 if this is greater than obj.</returns>
        public int CompareTo(object obj)
        {
            return Math.Sign(this.Weight - ((SideTrack_Node)obj).Weight);
        }
    }
}
