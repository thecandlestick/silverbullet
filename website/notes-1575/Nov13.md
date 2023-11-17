

Date: 2023-11-13


Reminders:
* [ ]  [[PA05]] released

Objectives:
* [ ] finish [[TreeMap]]
* [ ] introduce [[Priority Queues]]

---

<!-- #include [[examples/pre-order-traversal]] -->
```
pre-order-print(root):
  print(root)
  for child in root.children()
    pre-order-print(child)
```
<!-- /include -->

<!-- #include [[examples/treemap-destructor]] -->
```c++
template <typename K, typename V>
void TreeMap<K,V>::clear(MapNode<K,V> *&root)
{
  if (root == nullptr) return;

  clear(root->m_right); // de-allocate right subtree
  clear(root->m_left);  // de-allocate left subtree
  delete root;          // de-allocate root
  root = nullptr;
}

template <typename K, typename V>
TreeMap<K,V>::~TreeMap()
{
  clear(m_root);
}
<!-- /include -->

<!-- #include [[examples/treemap-class]] -->
```c++
template <typename K, typename V>
class MapNode
{
  private:
    K m_key;
    V m_value;
    MapNode<K,V> *m_left;
    MapNode<K,V> *m_right;
  
  public:
    // Node Constructors
    MapNode(K key, V val) : 
      m_key(key), m_value(val), m_left(nullptr), m_right(nullptr) {}
    MapNode(K key, V val, MapNode<K,V>* left, MapNode<K,V>* right) :
      m_key(key), m_value(val), m_left(left), m_right(right) {}

};
```

```c++
template <typename K, typename V>
class TreeMap
{
  private:
    MapNode<K,V> *m_root;  // Pointer to root node

    // Recursive operations, note: Private
    MapNode* find_helper(MapNode<K,V>* root, K key);
    V& at_helper(MapNode<K,V>* root, K key);
    void insert_helper(MapNode<K,V>*& root, K key, V val);
    void erase_helper(MapNode<K,V>*& root, K key);

    MapNode* getMin(MapNode<K,V>* root);
    MapNode* getMax(MapNode<K,V>* root);

  public:


    // Public functions to jump-start recursive operations
    MapNode* find(K key) {return find(m_root, key);}
    V& at(K key) {return at(m_root, key);}
    void insert(K key, V val) {insert(m_root, key, val);}
    void erase(K key) {erase(m_root, key, val);}
}
```
<!-- /include -->


## Operator=

[[examples/treemap-assign-op]]

<!-- #include [[examples/treemap-assign-op]] -->
```c++
template <typename K, typename V>
MapNode<K,V>* TreeMap<K,V>::clone(const MapNode<K,V>* root)
{
  if (root == nullptr)
    return nullptr;
  else
    return new MapNode<K,V>(root->m_key, root->m_value,
                    clone(root->m_left), clone(root->m_right));

  // Copy key/val from root then clone right/left subtrees
}

template <typename K, typename V>
TreeMap<K,V>& TreeMap<K,V>::operator=(const TreeMap<K,V> &rhs)
{
  clear(m_root);
  m_root = clone(rhs.m_root);
  return *this;
}
```
<!-- /include -->


## Copy Constructor

[[examples/treemap-copy-constructor]]

<!-- #include [[examples/treemap-copy-constructor]] -->
```c++
template <typename K, typename V>
TreeMap<K,V>::TreeMap(const TreeMap<K,V> &rhs)
{
  m_root = nullptr;
  *this = rhs;
}
```
<!-- /include -->


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

KC: Which of the following are valid heaps?

![](img/balanced-tree.png)

---
![](img%2Ftree4.png)

---

![](img%2Ftree5.png)

---

An interesting property of heaps is that they provide a **weak ordering** of the data. In informal terms, this simply means that not all elements are directly _comparable_ (nodes that are neither ancestor nor descendant are incomparable), but comparisons among elements is _transitive_ (if a > b && b > c then a > c). 

This matters because for use in a priority queue, we care only about the maximum/minimum element. A weak ordering like that of a heap is cheaper to maintain than a **total ordering** that would be given by a fully sorted collection.

# Building a Heap

You can view visualizations for these [here](http://btv.melezinek.cz/binary-heap.html)

## Adding nodes

DQ: 
* How to satisfy the _complete-tree_ property?
* How to satisfy the _heap_ property?

```
Enqueue-Heap(x):

  place x at ?

  while ( ? )
    swap ? with ?

```

## Removing nodes

DQ: 
* Which node would we want to remove (for a priority queue)?
* How to satisfy the _complete-tree_ property?
* How to satisfy the _heap_ property?

```
Dequeue-Heap(x):

  replace ? with ?

  while ( ? )
    swap ? with ?

```

## _Heapifying_ existing collection

DQ:
* How might we convert a random tree into a heap?
* Is this better than repeated insertions?

```
Sift-Down(x):

  while (?)
    swap ? with ?


Heapify collection by applying Sift-Down to each node, starting from the bottom
```


# Heaps and Data Structures

Even though logically a heap represents a tree structure, implementations of heaps most commonly make use of an array to store elements. This is an efficient choice because of the assumption that heaps are _complete_. 

To represent a heap using an array, we use a _level-ordering_ of the nodes. That is, we assign indices to nodes from top-to-bottom and left-to-right.

![](img/binheap.png)

It is possible to make an array-based representation for any arbitrary tree, but it would require us to allocate empty space in the array for any missing nodes that would otherwise be present in a complete tree.

## Indexing Schemes

Given the i-th element of a binary heap (the element at index i),

Can you give a formula for the following?

  *  index of left-child : 2*i + 1
  *  index of right-child : 2*i + 2
  *  index of parent : (i-1)/2

Challenge: Can you generalize these for heaps of degree 3 or degree n?

This gives us the ability to navigate our array-based heap in the same way that we would a tree-based heap implementation. Instead of following the edges of a tree, we simply apply the appropriate formula to our current array-index.

## C++ implementation for Binary Heap
  [[BinaryHeap]]
<!-- /include -->
