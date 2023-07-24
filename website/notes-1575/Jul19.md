

Date: 2023-07-19
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=7626dd80-9968-4e72-bc60-b044014eb581

Reminders:
* [x] PA05 is due Sunday

Objectives:
* [x] Finish Heaps
* [x] Start Binary Heap Implementation

---



# Building a Heap

You can view visualizations for these [here](http://btv.melezinek.cz/binary-heap.html)

## Adding nodes

DQ: 
* How to satisfy the _complete-tree_ property?
* How to satisfy the _heap_ property?

```
Enqueue-Heap(x):

  place x at first available spot (bottom level, leftmost)

  while ( x > parent and x is not the root )
    swap x with its parent

```

## Removing nodes

![](img/tree4.png)
DQ: 
* Which node would we want to remove (for a priority queue)? root
* How to satisfy the _complete-tree_ property?
* How to satisfy the _heap_ property?

  * [x] tony
  * [x] garret w
  * [x] sarah
  * [x] ben w

```
Dequeue-Heap():

  replace root with bottom rightmost node

  while ( root is greater than its children )
    swap root with smallest child

```

## _Heapifying_ existing collection

DQ:
* How might we convert a random tree into a heap?
* Is this better than repeated insertions?

```
Sift-Down(x):

  while ( x is greater than its children )
    swap x with smallest child


Heapify(root):

  Sift-Down(root)

  for each child:
    Sift-Down(child)
```


# Heaps and Data Structures

Even though logically a heap represents a tree structure, implementations of heaps most commonly make use of an array to store elements. This is an efficient choice because of the assumption that heaps are _complete_. 

To represent a heap using an array, we use a _level-ordering_ of the nodes. That is, we assign indices to nodes from top-to-bottom and left-to-right.

![](img/binheap.png)

It is possible to make an array-based representation for any arbitrary tree, but it would require us to allocate empty space in the array for any missing nodes that would otherwise be present in a complete tree.

## Indexing Schemes

* [x] sarah
* [x] tony
* [x] garret h
* [x] sarah
* [x] matt

Given the i-th element of a binary heap (the element at index i),

Can you give a formula for the following?

  *  index of left-child : 2*i + 1
  *  index of right-child : 2*i + 2
  *  index of parent : (i-1) / 2 (integer division)

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
![class diagram](arraylist-diagram.png)

The fast random-access provided by an [[ArrayList]] is sufficient for implementing a heap/priority-queue.

---
# Operations

## GetMax (top)
[[examples/binheap-top]]
<!-- #include [[examples/binheap-top]] -->
```c++
template <typename T>
const T& MaxBinaryHeap<T>::top()
{
  return m_data[0];
}
```
<!-- /include -->
