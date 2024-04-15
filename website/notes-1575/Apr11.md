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
  * MapNode * root
  * MapNode *& root

[[examples/treemap-insert]]

## Erase

Erasing an element from a BST while maintaining the search property can be a challenging task. We will need to come up with three separate plans for removing nodes of degree 0, 1, and 2.

Erasing a leaf node:

Erasing a node with 1 child:

Erasing a node with 2 children:

[[examples/treemap-erase]]

