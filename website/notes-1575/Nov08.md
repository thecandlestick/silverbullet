
Date: 2023-11-08


Reminders:
* [ ]  [[PA04]] due tonight

Objectives:
* [ ] introduce [[TreeMap]]

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
    MapNode* find(K key) {return find_helper(m_root, key);}
    V& at(K key) {return at_helper(m_root, key);}
    void insert(K key, V val) {insert_helper(m_root, key, val);}
    void erase(K key) {erase_helper(m_root, key, val);}
}
```



![](img%2Ftreemap-diagram.png)


---

# Operations (member functions)


## getMax / getMin

[[examples/treemap-get-max-min]]
<!-- #include [[examples/treemap-get-max-min]] -->
_Recursive_ Implementation
```c++
MapNode<K,V>* TreeMap<K,V>::getMax(MapNode<K,V> *root)
{
  if (root->m_right == nullptr)
    return root;
  return getMax(root->m_right);
}
```

_Iterative_ Implementation
```c++
MapNode<K,V>* TreeMap<K,V>::getMin(MapNode<K,V> *root)
{
  while (root->m_left != nullptr)
    root = root -> m_left;
  return root;
}
```
<!-- /include -->



## Find

We start with _find_. We don’t directly know where everything is in a BST, so we may need this operation for other tasks as well

[[examples/treemap-find]]
<!-- #include [[examples/treemap-find]] -->
```c++
template <typename K, typename V>
MapNode<K,V>* TreeMap<K,V>::find_helper(MapNode<K,V> *root, const K &search_key)
{
  if (root == nullptr)  // not found
    return nullptr;
  if (search_key == root->m_key) // found!
    return root;

  if (search_key < root->m_key)  // still searching ...
    return find_helper(root->m_left, search_key);

  return find_helper(root->m_right, search_key);
}
```
<!-- /include -->


## Get/Set

[[examples/treemap-get]]

```c++
template <typename K, typename V>
V& MapNode<K,V>::at(const K &access_key)
{
  MapNode<K,V> *access_node = find(access_key);
  if (access_node == nullptr)
    throw std::out_of_range("Key not found!");

  return access_node->m_value;
}
```


## Insert

DQ: For args passed to functions, what is the difference between: 
  * MapNode * (by-value)
  * MapNode *& (by-reference)

[[examples/treemap-insert]]
<!-- #include [[examples/treemap-insert]] -->
```c++
template <typename K, typename V>
void TreeMap<K,V>::insert_helper(MapNode<K,V> *&root, K new_key, V new_value)
{
  if (root == nullptr) // empty spot found! begin insertion
    root = new MapNode<K,V>(new_key, new_value);
  
  else  // still looking for proper placement
  {
    if (new_key < root->m_key)
      insert_helper(root->m_left, new_key, new_value);
    else if (new_key > root->m_key)
      insert_helper(root->m_right, new_key, new_value);
  }

  if (new_key == root->m_key)
    return; // no duplicates!
}
```
<!-- /include -->
