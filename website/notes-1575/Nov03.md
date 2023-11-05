

Date: 2023-11-03


Reminders:
* [ ]  [[PA04]] due wednesday

Objectives:
* [ ] continue [[Trees]]

---


# Trees and Data Structures

Instead of a _linear ordering_ of the data like that of the _sequence-based_ abstract data types we’ve seen before (stack, queue, list), tree-based ADT make use of a _hierarchical_ relationship. 

It is common to define a general-purpose _Tree_ Abstract Data Type for interacting with data that has an inherent hierarchical structure (see: Applications for Trees). For this course, however, we will focus on _Tree-inspired_ ADT and Data Structures that can be applied to any collection of data but utilize a hierarchy for efficiency purposes

## Working with unordered data

Because there is no linear ordering to a tree, we need to devise algorithms for _enumerating_ the data whenever we want to traverse through it. There are a number of ways to do this and each one gives us a different _order_. 

[[examples/pre-order-traversal]]
<!-- #include [[examples/pre-order-traversal]] -->
```
pre-order-print(root):
  print(root)
  for child in root.children()
    pre-order-print(child)
```
<!-- /include -->


[[examples/post-order-traversal]]
<!-- #include [[examples/post-order-traversal]] -->
```
post-order-print(root):
  for child in root.children
    post-order-print(child)
  print(root)
```
<!-- /include -->


You can experiment with these algorithms for binary trees [here](https://tree-visualizer.netlify.app/)

## Special Trees

A tree for optimizing _search/find_ operations
[[BST]]

A tree for optimizing _getMax/getMin_ operations
[[Heaps]]

<!-- #include [[examples/runtime-logarithm]] -->
![](img%2FBinarySearch.png)
```c++
bool binarySearch(int A*, int n, int x) //find x in array A of size n
{
  int low = 0;
  int high = n-1;
  while (low <= high)
  {
    int mid = low + (high-low)/2; // start searching in the middle
    if (A[mid] == x)
      return true;
    else if (A[mid] < x) // x can't be "left"
      low = mid + 1;
    else
      high = mid - 1; // x can't be "right"
  }
}
```

How many times will the while loop iterate in terms of n?

RTF: ?
<!-- /include -->

# Binary Search Trees

A BST is a **binary tree** that possesses the **search property**

* A binary tree is one in which every node has _at most_ 2 children
  * We will refer to these children as the **left-subtree** and **right-subtree**
* The _search property_ means that:
  * Every node is **comparable** with every other node and **no duplicates** are allowed
  * For any given node _N_,
    * _N_ is _lesser than_ every node in the _right-subtree_
    * _N_ is _greater than_ every node in the _left-subtree_


_KC: Which of the following are valid Binary Search Trees?_

![](img%2Ftree1.png)

---

![](img%2Ftree2.png)

---

![](img%2Ftree3.png)

The primary benefit of designing data structures that maintain these properties is that it allows for efficient searching of the data by use of the [[examples/runtime-logarithm|Binary Search]] algorithm.

