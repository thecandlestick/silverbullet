

Date: 2023-10-30


Reminders:
  * [ ]  [[PA04]] released!

Objectives:
* [ ] introduce [[Trees]]

---

The **N-Queens problem** is as follows:
  _Given a n-by-n chessboard, place n queen pieces such that no two queens can attack each other_

Pseudocode for the _n-Queens_ problem:
```
1. try-queen(int row):
2.   int col <- first valid column
3.   while valid columns remaining
4.     place i-th queen at `col`
5.     if no more queens
6.       return success
7.     trial <- try-queen(i+1)
8.     if trial is success
9.       return success
10.     else
11.       retract i-th queen placement
12.      col <- next valid column
13.   return failure
```

Try to follow the algorithm yourself [here](http://eightqueen.becher-sundstroem.de/). Visualize each row as it’s own recursive function call and picture the call stack as you go.


Trees are a very special mathematical object that have inspired many data structures and algorithms. Trees appear all throughout the field of computer science in the most unexpected of places.

# 🌲 and Me: an introduction

Trees consist of **nodes** and **edges**. Nodes represent individual elements and edges form connections between them. For those familiar with graph theory, a Tree is a special case of [[Graphs]] (specifically a _connected, undirected, acyclic graph_).

## Terminology

* The **root** stands at the top of the hierarchy
* Any nodes directly connected to the root are its **children**
* All nodes (except the root) have exactly one **parent**
  * A **cycle** cannot exist in a tree
  * A tree with _n_ nodes has exactly _n-1_ edges
* A node with no children is called a **leaf**

![](img%2Ftree-terminology.png)

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

What does this tell us? ==Any_ node in a tree forms a **sub-tree** with its descendants... recursion ensues!==

# Applications for Trees

**Expression trees**

![](img%2Fexpression-tree.png)

**File systems**

![](img%2Fdirectory-tree.png)

**Data structures & Algorithms!**

_honorable mentions:_ parse trees(Theory), spanning trees(Networks), decision trees(AI)
