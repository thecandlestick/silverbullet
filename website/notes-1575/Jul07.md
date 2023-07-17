

Date: 2023-07-07
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=20a5e521-b26c-4504-a5b6-b03801462c9a

Reminders:
* [x] PA03 is due tonight
* [x] quiz4 due monday

Objectives:
* [x] start discussion of Trees

---

Trees are a very special mathematical object that have inspired many data structures and algorithms. Trees appear all throughout the field of computer science in the most unexpected of places.

# 🌲 and Me: an introduction

Trees consist of **nodes** and **edges**. Nodes represent individual elements and edges form connections between them.

## Terminology

* The **root** stands at the top of the hierarchy
* Any nodes directly connected to the root are its **children**
* All nodes (except the root) have exactly one **parent**
  * A **cycle** cannot exist in a tree
  * A tree with _n_ nodes has exactly _n-1_ edges
* A node with no children is called a **leaf**

![](img%2Ftree-terminology.png)

<3, 5, 7, 11> // length 3
<3, 5, 7, 9> // not valid path!

* [x] garret w
* [x] sarah
* [x] tony
* [x] garret h

* The **degree** of a node is the number of children that it has
* The **degree** of a tree is the highest degree of any node

A **path** in a tree is a sequence of nodes <n0, n1, ... , nk> such that for all {i = 0, 1, ... , k-1}, n(i+1) is the parent of n(i)
  * k is the **length** of such a path
  * Every node has a unique path from itself to the root

For any given node _N_
* All nodes along its unique path to the root are **ancestors** of _N_
* All nodes for which there is a path to _N_ are its **descendants**

* The **depth** of a node is the length of the unique path to the root
  * The root has a depth of zero
* Nodes with the same depth form a **level** of the tree
* The **height** of a tree is the number of levels it has

There are many ways of defining the properties of Trees, but for this class we are most interested in their _recursive_ structure.

  * a single node is a tree
  * two trees joined by a single edge is also a tree

    n nodes tree + n nodes tree + one edge

    how many nodes total: 2n
    how many edges: n-1 + (n-1) + 1 = 2n -1

* [x] dheeraj
* [x] sarah
* [x] tony

What does this tell us? _Any_ node in a tree forms a **sub-tree** with its descendants... recursion ensues!

# Applications for Trees

**Expression trees**

![](img%2Fexpression-tree.png)

2 * ==(3 + 4)==


**File systems**

![](img%2Fdirectory-tree.png)


**Data structures & Algorithms!**

_honorable mentions:_ parse trees(Theory), spanning trees(Networks), decision trees(AI)

# Trees and Data Structures

Instead of a _linear ordering_ of the data like that of the _sequence-based_ abstract data types we’ve seen before (stack, queue, list), tree-based ADT make use of a _hierarchical_ relationship. 


