
# Objective

When discussing [[BST|Binary Search Trees]], we saw how they can be used to build data structures with **O(lg(n))** Find, Insert, and Erase operations. This assumes, however, that the height of the tree is also maintained at **O(lg(n))**. This can be achieved by modifying the operations to ensure that the tree remains relatively _balanced_.

Your objective is to research and implement a method of building a _Self-Balancing BST_, one that always maintains a height of **O(lg(n))** where n is the number of nodes in the tree.

# Requirements

You will deliver a PDF report by the end of the semester with the following components:

### Self-Guided Research

In this section of your report, describe the theory behind your choice of self-balancing BST. Why does it guarantee a height of **O(lg(n))**? You should give a formal, mathematical argument using big-Oh notation and provide some examples to demonstrate how it works.

Examples of self-balancing BST:
* Red-black trees
* Scapegoat trees
* AVL trees
* Treaps

_You must confirm your choice of implementation with your instructor. It does not have to be one listed above_

### Code Implementation

In this section of your report, you will document your process of implementing a balanced BST in C++. You **must** use the un-balanced BST from [[PA05]] as a starting point, and your work must be well commented.
Describe what aspects of the original code you changed (hint: at minimum, insert and erase should be changed to maintain the balance of the tree), and show your final source code. (Preferably, link to a git repository)

### Performance Analysis

In this section, you will analyze the performance of your balanced BST to verify that it is working correctly. Construct a benchmark of inputs (sequence of operations) to empirically test the un-balanced vs. balanced tree. Examples of metrics to test include the height of the tree or the average time spent on operations (gathered using a profiler), or another method of your choosing.

_note: you may need a large benchmark to see significant results_

# Resources

You are free to select any variation of binary search trees you wish, so long as you can prove that it maintains a tree with logarithmic height.

Open Data Structures (free textbook) covers some potential options in chapters 6-9, but you may use any other resources you prefer.

https://opendatastructures.org/ods-cpp/Contents.html