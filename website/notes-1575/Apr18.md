#cs1575LN
|  |  |  |  |
|----------|----------|----------|----------|
| [[CS1575|Home]] | [[CS1575 Calendar|Calendar]] | [[CS1575 Syllabus|Syllabus]] | [[Lecture Notes]] |


## Reminders

```query
cs1575task
where done = false
render [[template/task]]
```

## Objectives

```query
task
where page = "CS1575 Calendar" and done = false
limit 3
order by pos
render [[template/topic]]
```
---

# Default Member Functions

## Destructor

_DQ: Is pre-order or post-order traversal better for clearing all data?_

[[examples/treemap-destructor]]

## Operator=

[[examples/treemap-assign-op]]

## Copy Constructor

[[examples/treemap-copy-constructor]]


# The Priority Queue Abstract Data Type

A Priority Queue is a collection of data, together with a _function_ mapping each element to its _priority_.

{ <val1>, <val2>, ... , <val_n> }

A Priority Queue differs from the standard Queue ADT follows a strategy where only the element with the **highest priority** is accessible. Since elements can be added to a Priority Queue in any order, a [[Heaps|Heap]] structure is most often used to organize the elements and avoid expensive searching for the highest priority.

## Operations

* getMax(PQ) -> the element of PQ with highest priority
* enqueue(PQ, value) -> PQ’ with new element _value_
* dequeue(PQ) -> PQ’ with highest priority element removed


---


# Priority Queue Data Structures

## C++ standard library implementations:
  * [std::priority_queue](https://en.cppreference.com/w/cpp/container/priority_queue)

## Our Implementations:

[[BinaryHeap]]


# Properties of Heaps

A heap is a **complete tree** that possesses the **heap property**. A complete tree is one in which every _level_ of the tree except the last level is completely full and the last level is partially filled from left to right.

Though a heap does not have to be a binary tree, binary heaps are widely studied.

The **min-heap property** means that given any node _N_ in the tree, _N_ is _lesser than_ all of its descendants. In a min-heap, the root node is the minimum element.

The **max-heap property** means that given any node _N_ in the tree, _N_ is _greater than_ all of its descendants. In a max-heap, the root node is the maximum element.

#KnowledgeCheck: Which of the following are valid heaps?

![](../img/balanced-tree.png)

---
![](../img%2Ftree4.png)

---


An interesting property of heaps is that they provide a **partial ordering** of the data. In informal terms, this simply means that not all elements are directly _comparable_ (nodes that are neither ancestor nor descendant are incomparable), but comparisons among elements is _transitive_ (if a > b && b > c then a > c). 

This matters because for use in a priority queue, we care only about the maximum/minimum element. A partial ordering like that of a heap is cheaper to maintain than a **total ordering** that would be given by a fully sorted collection.

# Building a Heap

You can view visualizations for these [here](http://btv.melezinek.cz/binary-heap.html)

## Adding nodes

DQ: 
* How to satisfy the _complete-tree_ property?
* How to satisfy the _heap_ property?

```
Enqueue-Heap(x): (min-heap)

  place x at bottom-most spot

  while ( x.parent > x )
    swap x with parent

```

## Removing nodes

DQ: 
* Which node would we want to remove (for a priority queue)?
* How to satisfy the _complete-tree_ property?
* How to satisfy the _heap_ property?

```
Dequeue-Heap(): (min-heap)

  replace root with bottom-most node
  remove bottom-most

  while ( new root > children )
    swap new root with lesser-child

```
