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
# TreeMap Class & Diagram

[[examples/treemap-class]]


![](../img%2Ftreemap-diagram.png)



---

# Operations (member functions)


## getMax / getMin

[[examples/treemap-get-max-min]]

## Find

We start with _find_. We don’t directly know where everything is in a BST, so we may need this operation for other tasks as well

[[examples/treemap-find]]

## Get/Set

[[examples/treemap-get]]

## Insert

DQ: For args passed to functions, what is the difference between: 
  * MapNode *
  * MapNode *&

[[examples/treemap-insert]]

## Erase

Erasing an element from a BST while maintaining the search property can be a challenging task. We will need to come up with three separate plans for removing nodes of degree 0, 1, and 2.

Erasing a leaf node:

 _just delete it_
  
Erasing a node with 1 child:

  _promote the child of the node to be removed_

Erasing a node with 2 children:

  _promote the right-most element of left-subtree OR left-most element of right-subtree_

[[examples/treemap-erase]]


---

# Default Member Functions

## Destructor

_DQ: Is pre-order or post-order traversal better for clearing all data?_

[[examples/treemap-destructor]]

## Operator=

[[examples/treemap-assign-op]]

## Copy Constructor

[[examples/treemap-copy-constructor]]