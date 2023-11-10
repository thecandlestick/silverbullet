

Date: 2023-11-06


Reminders:
* [ ]  [[PA04]] due wednesday

Objectives:
* [ ] continue [[BST]]
* [ ] Introduce [[Maps]]

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


_KC: Which of the following are valid Binary Search Trees?_

![](img%2Ftree1.png)

---

![](img%2Ftree2.png)

---

![](img%2Ftree3.png)

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

* What determines the _Worst-Case_ scenario? ==height of tree==
* What kind of BST have an ideal _Worst-Case_ (for a size of n nodes)? ==balanced BST==

## Building a BST

When thinking about using a BST for storing data, that BST of course needs to be built from an existing collection of data and grow as new data arrives. 

A useful thing to note is that given an existing BST and a value _x_, there is only a single valid placement of _x_ at the bottom of the tree (among the leaf nodes). Since adding a leaf node never requires any re-structuring of the rest of the tree, we can treat the cost of adding a node as equal to the cost of searching for a node (the cost of finding the unique valid placement).

A similar argument can be made for removal of nodes in a BST. We must first find where a given node is in the BST before we can remove it, making the cost also equal to the cost of search.

## A Balanced Tree is a Happy Little Tree 🌲🖌️🧑🏻‍🎨

The height of our tree plays a key role in the efficiency of our operations, and the height of a tree is correlated with how _balanced_ it is (the difference in size of its sub-trees).

![](img%2Fdegen-tree.png)
For a _degenerate_ BST like the one above, the cost of search is O(height) = O(n), where n is the number of nodes.

![](img%2Fbalanced-tree.png)
For a _perfect_ BST like the one above, the cost of search is
O(height) = O(lg n), where n is the number of nodes.


When operating on a BST in a data structure, we have the opportunity to strategically add and remove nodes in a way that will maintain the balance of the tree. There are many methods of building these _self-balancing_ trees (randomized BST, scapegoat trees, treaps, Red-Black Trees, AVL trees, etc.). We will therefore make the assumption of a roughly balanced tree when utilizing a BST in our data structures.

[[Honors Project]]


# The Map Abstract Data Type

A Map is an _unordered collection(set)_ of pairs. Each pair consists of a **key** and a **value**. 

{ <key1, val1>, <key2, val2>, ... , <keyn, valn> }

Keys in a Map must be _unique_ so that no two pairs have the same _key_, but there is no such restriction on _values_.

## Operations

- getValue(M, key) -> the value paired with _key_, if _key_ is in M
- setValue(M, key, value) -> M’ with updated pair _<key, value>_
- insert(M, key, value) ->  M’ with new pair _<key, value>_
- erase(M, key) -> M’ without pair identified by _key_
- find(M, key) -> true if _key_ in M, false otherwise


The motivation behind the Map is that unlike the List we do not need to maintain the order of the data. This allows us to strategically structure the data to optimize our operations as much as possible. This ADT also commonly goes by the name of _Dictionary_

---


# Map Data Structures

## C++ standard library implementations:
* [std::map](https://en.cppreference.com/w/cpp/container/map)
* [std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map)

## Our Implementations:

[[TreeMap]] - Memory-efficient implementation based on [[BST]]

[[HashMap]] - Time-efficient implementation based on associative arrays

