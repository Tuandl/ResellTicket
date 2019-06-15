using System;
using System.Collections.Generic;

namespace Algorithm.KShortestPaths.Models
{
    /// <summary>
    /// Generic class for priority queue, it is based on Heap in array 
    /// </summary>
    /// <typeparam name="T">Type of data object. Must implement IComparable interface</typeparam>
    /// <remarks>Lower Weight in queue has higher priority</remarks>
    /// <remarks>Insert, Retrive Complexity: O(log N)</remarks>
    /// <remarks>Searching Complexity: O(log N)</remarks>
    public class PriorityQueue <T> where T : IComparable
    {
        private List<T> data;

        public PriorityQueue()
        {
            this.data = new List<T>();
        }

        /// <summary>
        /// Insert a new item in heap
        /// </summary>
        /// <param name="item"></param>
        public void Enqueue(T item)
        {
            data.Add(item);
            int child_index = data.Count - 1; // child index; start at end
            while (child_index > 0)
            {
                int parent_index = (child_index - 1) / 2; // parent index
                if (data[child_index].CompareTo(data[parent_index]) >= 0) 
                    break; // stop when child item is larger than (or equal) parent
                //Swap new item with its parent
                T tmp = data[child_index]; data[child_index] = data[parent_index]; data[parent_index] = tmp;
                child_index = parent_index;
            }
        }

        /// <summary>
        /// Get top item and remove it from heap
        /// </summary>
        /// <returns></returns>
        public T Dequeue()
        {
            if(this.Count() == 0) return default;

            // assumes pq is not empty; up to calling code
            int last_index = data.Count - 1; // last index (before removal)
            T frontItem = data[0];   // fetch the front
            data[0] = data[last_index];
            data.RemoveAt(last_index);

            --last_index; // last index (after removal)
            int parent_index = 0; // parent index. start at front of pq
            while (true)
            {
                int leftChild_index = parent_index * 2 + 1; // left child index of parent
                if (leftChild_index > last_index) break;  // no children so done

                int rightChild_index = leftChild_index + 1;     // right child

                // if there is a rc (ci + 1), and it is smaller than left child, use the rc instead
                if (rightChild_index <= last_index && data[rightChild_index].CompareTo(data[leftChild_index]) < 0)
                    leftChild_index = rightChild_index;

                // parent is smaller than (or equal to) smallest child so done
                if (data[parent_index].CompareTo(data[leftChild_index]) <= 0) 
                    break;

                // swap parent and child
                T tmp = data[parent_index]; data[parent_index] = data[leftChild_index]; data[leftChild_index] = tmp; 
                parent_index = leftChild_index;
            }
            return frontItem;
        }

        /// <summary>
        /// Retrive the top data
        /// </summary>
        /// <returns></returns>
        public T Peek()
        {
            T frontItem = data[0];
            return frontItem;
        }

        /// <summary>
        /// Get Queue Length
        /// </summary>
        /// <returns></returns>
        public int Count()
        {
            return data.Count;
        }
    }
}
