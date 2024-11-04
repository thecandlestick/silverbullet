---
tags: template
hooks.snippet.slashCommand: bst
---

# Binary Search Trees

A BST is a **binary tree** that possesses the **search property**

* A binary tree is one in which every node has _at most_ 2 children
  * We will refer to these children as the **left-subtree** and **right-subtree**
* The _search property_ means that:
  * Every node is **comparable** with every other node and **no duplicates** are allowed
  * For any given node _N_,
    * _N_ is _lesser than_ every node in the _right-subtree_
    * _N_ is _greater than_ every node in the _left-subtree_


_#KnowledgeCheck: Which of the following are valid Binary Search Trees?_

![](img%2Ftree1.png)

---

![](img%2Ftree2.png)

---

![](img%2Ftree3.png)

The primary benefit of designing data structures that maintain these properties is that it allows for efficient searching of the data by use of the [[examples/runtime-logarithm|Binary Search]] algorithm.


# Finding Elements in a BST

Finding a piece of data in a Binary Search Tree follows a straightforward recursive algorithm.

```py
search(root, value):
  if root.data == value
    return success

  if root.data > value
    if root.left_subtree exists  
      return search(left_subtree, value)
    else
      return failure

  if root.right_subtree exists
    return search(right_subtree, value)
  else
    return failure
```


You can visualize this in action [here](http://btv.melezinek.cz/binary-search-tree.html)

The algorithm relies on the concept of the _search property_. If the element that we’re looking for is _less than_ the node we’re currently observing, then the search property tells us that, if the element exists, it _must_ be somewhere in the _left-subtree_. (why?)

Every subtree in a BST is a smaller but still valid BST, so at each level we continue the search with a recursive call in the correct direction.

---
# The Efficiency of a BST

## Building a BST

When thinking about using a BST for storing data, that BST of course needs to be built from an existing collection of data and grow as new data arrives. 

A useful thing to note is that given an existing BST and a value _x_, there is only a single valid placement of _x_ at the bottom of the tree (among the leaf nodes). Since adding a leaf node never requires any re-structuring of the rest of the tree, we can treat the cost of adding a node as equal to the cost of searching for a node (the cost of finding the unique valid placement).

A similar argument can be made for removal of nodes in a BST. We must first find where a given node is in the BST before we can remove it, making the cost also equal to the cost of search.


## Efficiency of Search

What is the time complexity of this search algorithm? In other words, how many recursive calls will we have to make in the worst case scenario?

* What determines the _Worst-Case_ scenario?
* What kind of BST have an ideal _Worst-Case_ (for a size of n nodes)?



### A Balanced Tree is a Happy Little Tree 🌲🖌️🧑🏻‍🎨

The height of our tree plays a key role in the efficiency of our operations, and the height of a tree is correlated with how _balanced_ it is (the difference in size of its sub-trees).

![](img%2Fdegen-tree.png)
For a _degenerate_ BST like the one above, the cost of search is O(height) = O(n), where n is the number of nodes.

![](img%2Fbalanced-tree.png)
For a _perfect_ BST like the one above, the cost of search is
O(height) = O(?), where n is the number of nodes.

---
#Theorem for a perfect binary tree
```latex
\text{number of nodes } (n) = \sum_{i=0}^{\text{height}} 2^i = 2^{\text{height}+1}-1
```

---

When operating on a BST in a data structure, we have the opportunity to strategically add and remove nodes in a way that will maintain the balance of the tree. There are many methods of building these _self-balancing_ trees (scapegoat trees, treaps, Red-Black Trees, AVL trees, etc.). We will simply make the assumption of a roughly balanced tree when utilizing a BST in our data structures for this class.

[[Honors Project - Self Balancing BST]]