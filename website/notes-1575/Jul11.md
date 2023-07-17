

Date: 2023-07-11
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=5ee02de7-ce96-4776-ac3c-b03c0162b586

Reminders:
* [x] PA04 released

Objectives:
* [x] finish BST
* [x] start Maps

---


# The Efficiency of a BST

What is the time complexity of this search algorithm? In other words, how many recursive calls will we have to make in the worst case scenario?

* What determines the _Worst-Case_ scenario?
* What kind of BST have an ideal _Worst-Case_ (for a size of n nodes)?

## Building a BST

When thinking about using a BST for storing data, that BST of course needs to be built from an existing collection of data and grow as new data arrives. 

A useful thing to note is that given an existing BST and a value _x_, there is only a ==single valid placement== of _x_ at the bottom of the tree (among the leaf nodes). Since adding a leaf node never requires any re-structuring of the rest of the tree, we can treat the cost of adding a node as equal to the cost of searching for a node (the cost of finding the unique valid placement).

[[examples/runtime-logarithm]]

* [x] garret w
* [x] sarah
* [x] ben w

A similar argument can be made for removal of nodes in a BST. We must first find where a given node is in the BST before we can remove it, making the cost also equal to the cost of search.

## A Balanced Tree is a Happy Little Tree 🌲🖌️🧑🏻‍🎨

The height of our tree plays a key role in the efficiency of our operations, and the height of a tree is correlated with how _balanced_ it is (the difference in size of its sub-trees).

![](img%2Fdegen-tree.png)
For a _degenerate_ BST like the one above, the cost of search is O(height) = O(n), where n is the number of nodes.

![](img%2Fbalanced-tree.png)
For a _perfect_ BST like the one above, the cost of search is
O(height) = O(lg(n)), where n is the number of nodes.

level 0 - 1
level 1 - 2
level 2 - 4
level n - 2^n

height is O(log_base2 of n)

When operating on a BST in a data structure, we have the opportunity to strategically add and remove nodes in a way that will maintain the balance of the tree. There are many methods of building these _self-balancing_ trees (randomized BST, scapegoat trees, treaps, Red-Black Trees, AVL trees, etc.). We will therefore make the assumption of a roughly balanced tree when utilizing a BST in our data structures.

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

* [x] dheeraj

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

* [x] dheeraj
* [x] sarah

[[examples/treemap-class]]
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
    MapNode<K,V> *m_root;

  public:
    MapNode* find(MapNode<K,V>* root, K key);
    V& at(MapNode<K,V>* root, K key);
    MapNode* getMin(MapNode<K,V>* root);
    MapNode* getMax(MapNode<K,V>* root);
    void insert(MapNode<K,V>*& root, K key, V val);
    void erase(MapNode<K,V>*& root, K key);
}
```
<!-- /include -->

![](img%2Ftreemap-diagram.png)


