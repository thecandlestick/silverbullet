

Date: 2023-07-10
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=c8a5a188-b489-4959-8fdb-b03b01393681

Reminders:
* [x] Quiz 4 due tonight (stacks, queues, recursion)

Objectives:
* [x] Continue trees
* [x] introduce BST

---


There are many ways of defining the properties of Trees, but for this class we are most interested in their _recursive_ structure.

  * a single node is a tree
  * two trees joined by a single edge is also a tree

What does this tell us? _Any_ node in a tree forms a **sub-tree** with its descendants... recursion ensues!

# Applications for Trees

**Expression trees**

![](img%2Fexpression-tree.png)

**File systems**

![](img%2Fdirectory-tree.png)

**Data structures & Algorithms!**

_honorable mentions:_ parse trees(Theory), spanning trees(Networks), decision trees(AI)

# Trees and Data Structures

Instead of a _linear ordering_ of the data like that of the _sequence-based_ abstract data types we’ve seen before (stack, queue, list), tree-based ADT make use of a _hierarchical_ relationship. 

It is common to define a general-purpose _Tree_ Abstract Data Type for interacting with data that has an inherent hierarchical structure (see: Applications for Trees). For this course, however, we will focus on _Tree-inspired_ ADT and Data Structures that can be applied to any collection of data but utilize a hierarchy for efficiency purposes

## There is no order. Give me your data 🖐😐

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

* [x] sarah
* [x] tony x2

[[examples/post-order-traversal]]
<!-- #include [[examples/post-order-traversal]] -->
```
post-order-print(root):
  for child in root.children
    post-order-print(child)
  print(root)
```
<!-- /include -->

* [x] garret w
* [x] dheeraj
* [x] tony

You can experiment with these algorithms for binary trees [here](https://tree-visualizer.netlify.app/)

## Special Trees

A tree for optimizing _search/find_ operations
[[BST]]

# Binary Search Trees

A BST is a **binary tree** that possesses the **search property**

* A binary tree is one in which every ==node has _at most_ 2 children==
  * We will refer to these children as the **left-subtree** and **right-subtree**
* The _search property_ means that:
  * Every node is **comparable** ( a < b || b < a || b == a ) with every other node and **no duplicates** are allowed
  * For any given node _N_,
    * _N_ is _lesser than_ every node in the _right-subtree_
    * _N_ is _greater than_ every node in the _left-subtree_

* [x] sarah
* [x] matt
* [x] tony

**Test yourself:** _Which of the following are valid Binary Search Trees?_

![](img%2Ftree1.png)
* [x] sarah
* [x] kilian
* [x] matt
* [x] tony


---

![](img%2Ftree2.png)

---

![](img%2Ftree3.png)
* [x] matt
* [x] sarah
* [x] duc
* [x] garret w
* [x] kilian

The primary benefit of designing data structures that maintain these properties is that it allows for efficient searching of the data by use of the [[examples/runtime-logarithm|Binary Search]] algorithm.


# Finding Elements in a BST

Finding a piece of data in a Binary Search Tree follows a straightforward recursive algorithm.

```
search(root, value):
  if root.data == value
    return success

  if root.data > value
    if root.left-subtree exists
      return search(left-subtree, value)
    else
      return failure

  if root.right-subtree exists
    return search(right-subtree, value)
  else
    return failure
```


You can visualize this in action [here](http://btv.melezinek.cz/binary-search-tree.html)

The algorithm relies on the concept of the _search property_. If the element that we’re looking for is _less than_ the node we’re currently observing, then the search property tells us that, if the element exists, it _must_ be somewhere in the _left-subtree_. (why?)

Every subtree in a BST is a smaller but still valid BST, so at each level we continue the search with a recursive call in the correct direction.

---
# The Efficiency of a BST

What is the time complexity of this search algorithm? In other words, how many recursive calls will we have to make in the worst case scenario?

* What determines the _Worst-Case_ scenario?  O(height)
* What kind of BST have an ideal _Worst-Case_ (for a size of n nodes)?
  * full, balanced (perfect BST)

* [x] kilian
* [x] tony
* [x] sarah


## Building a BST

When thinking about using a BST for storing data, that BST of course needs to be built from an existing collection of data and grow as new data arrives. 

A useful thing to note is that given an existing BST and a value _x_, there is only a single valid placement of _x_ at the bottom of the tree (among the leaf nodes). Since adding a leaf node never requires any re-structuring of the rest of the tree, we can treat the cost of adding a node as equal to the cost of searching for a node (the cost of finding the unique valid placement).

A similar argument can be made for removal of nodes in a BST. We must first find where a given node is in the BST before we can remove it, making the cost also equal to the cost of search.