

Date: 2023-11-27


Reminders:
* [ ]  [[PA05]] due tonight

Objectives:
* [ ] continue [[Heaps]]
* [ ] [[BinaryHeap]]

---


## _Heapifying_ existing collection

DQ:
* How might we convert a random tree into a heap?
* Is this better than repeated insertions?

```
(max-heap)
Sift-Down(x):

  while ( x is less than either child )
    swap x with largest child


Heapify collection by applying Sift-Down to each node, starting from the bottom
```


# Heaps and Data Structures

Even though logically a heap represents a tree structure, implementations of heaps most commonly make use of an array to store elements. This is an efficient choice because of the assumption that heaps are _complete_. 

To represent a heap using an array, we use a _level-ordering_ of the nodes. That is, we assign indices to nodes from top-to-bottom and left-to-right.

![](img/binheap.png)

It is possible to make an array-based representation for any arbitrary tree, but it would require us to allocate empty space in the array for any missing nodes that would otherwise be present in a complete tree.

## Indexing Schemes

Given the i-th element of a binary heap (the element at index i),

Can you give a formula for the following?

  *  index of left-child : 2 i + 1
  *  index of right-child : 2 i + 2
  *  index of parent : ( i - 1 ) / 2 (integer div)

Challenge: Can you generalize these for heaps of degree 3 or degree n?

This gives us the ability to navigate our array-based heap in the same way that we would a tree-based heap implementation. Instead of following the edges of a tree, we simply apply the appropriate formula to our current array-index.

## C++ implementation for Binary Heap
  [[BinaryHeap]]


# Class & Diagram

[[examples/binheap-class]]
<!-- #include [[examples/binheap-class]] -->
```c++
template <typename T>
class MaxBinaryHeap : public ArrayList<T>
{
  private:
    void siftDown(int start_index);
  public:
    void push(const T& val);
    void pop();
    const T& top();
}
```
<!-- /include -->


The fast random-access provided by an [[ArrayList]] is sufficient for implementing a heap/priority-queue.

![ArrayList diagram](img/arrlist-diagram.png)

