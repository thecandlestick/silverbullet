

Date: 2023-11-17


Reminders:
* [ ]  [[PA05]] due after break

Objectives:
* [ ] continue with [[Heaps]]

---


# Properties of Heaps

A heap is a **complete tree** that possesses the **heap property**. A complete tree is one in which every _level_ of the tree except the last level is completely full and the last level is partially filled from left to right.

Though a heap does not have to be a binary tree, binary heaps are widely studied.

The **min-heap property** means that given any node _N_ in the tree, _N_ is _lesser than_ all of its descendants. In a min-heap, the root node is the minimum element.

The **max-heap property** means that given any node _N_ in the tree, _N_ is _greater than_ all of its descendants. In a max-heap, the root node is the maximum element.

KC: Which of the following are valid heaps?

![](img/balanced-tree.png)

---
![](img%2Ftree4.png)

---

![](img%2Ftree5.png)

---

An interesting property of heaps is that they provide a **weak ordering** of the data. In informal terms, this simply means that not all elements are directly _comparable_ (nodes that are neither ancestor nor descendant are incomparable), but comparisons among elements is _transitive_ (if a > b && b > c then a > c). 

This matters because for use in a priority queue, we care only about the maximum/minimum element. A weak ordering like that of a heap is cheaper to maintain than a **total ordering** that would be given by a fully sorted collection.

# Building a Heap

You can view visualizations for these [here](http://btv.melezinek.cz/binary-heap.html)

## Adding nodes

DQ: 
* How to satisfy the _complete-tree_ property?
* How to satisfy the _heap_ property?

```
Enqueue-Heap(x): (min-heap)

  place x at bottom-leftmost available spot

  while ( x < parent )
    swap x with parent

```

## Removing nodes

DQ: 
* Which node would we want to remove (for a priority queue)? **root**
* How to satisfy the _complete-tree_ property?
* How to satisfy the _heap_ property?

```
Dequeue-Heap(): (min-heap)

  replace root with bottom-rightmost node

  let x be root node

  while ( x > either child )
    swap x with smallest child

```
