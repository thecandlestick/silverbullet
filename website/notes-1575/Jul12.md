

Date: 2023-07-12
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=30ddfe18-21ae-4e47-8377-b03d0136d56c

Reminders:
* [x] PA04 due friday

Objectives:
* [x] Continue TreeMap

---

# TreeMap Class & Diagram

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


---

# Operations (member functions)


## getMax / getMin

* [x] sarah
* [x] dheeraj
* [x] ben w

[[examples/treemap-get-max-min]]

<!-- #include [[examples/treemap-get-max-min]] -->
```c++
MapNode<K,V>* TreeMap<K,V>::getMax(MapNode<K,V> *root)
{
  if (root->m_right == nullptr)
    return root;
  return getMax(root->m_right);
}
```

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

It makes sense to start with _find_ because we don’t directly know where everything is in a BST

[[examples/treemap-find]]
<!-- #include [[examples/treemap-find]] -->
```c++
template <typename K, typename V>
MapNode<K,V>* TreeMap<K,V>::find(MapNode<K,V> *root, const K &search_key)
{
  if (root == nullptr)  // not found
    return nullptr;
  if (search_key == root->m_key) // found!
    return root;

  if (search_key < root->m_key)  // still searching ...
    return find(root->m_left, search_key);

  return find(root->m_right, search_key);
}
```
<!-- /include -->



* [x] garret h
* [x] garret h

## Get/Set

[[examples/treemap-get]]

<!-- #include [[examples/treemap-get]] -->
```c++
template <typename K, typename V>
V& MapNode<K,V>::at(MapNode<K,V> *root, const K &access_key)
{
  MapNode<K,V> *access_node = find(root, access_key);
  if (access_node == nullptr)
    throw std::out_of_range("Key not found!");

  return access_node->m_value;
}
```
<!-- /include -->

* [x] Duc

## Insert

KC: For args passed to functions, what is the difference between: 
  * MapNode<K,V> *
  * MapNode<K,V> *&

* [x] sarah
* [x] garret w
* [x] duc

![](img%2Ftreemap-diagram.png)

[[examples/treemap-insert]]
<!-- #include [[examples/treemap-insert]] -->
```c++
template <typename K, typename V>
void TreeMap<K,V>::insert(MapNode<K,V> *&root, K new_key, V new_value)
{
  if (root == nullptr) // empty spot found! begin insertion
    root = new MapNode<K,V>(new_key, new_value);
  
  else  // still looking for proper placement
  {
    if (new_key < root->m_key)
      insert(root->m_left, new_key, new_value);
    else if (new_key > root->m_key)
      insert(root->m_right, new_key, new_value);
  }

  if (new_key == root->m_key)
    return; // no duplicates!
}
```
<!-- /include -->


## Erase

![](img%2Ftreemap-diagram.png)

Erasing an element from a BST while maintaining the search property can be a challenging task. We will need to come up with three separate plans for removing nodes of degree 0, 1, and 2.

* [x] sarah
* [x] duc
* [x] doug x2

Erasing a leaf node:

* delete that node
* set nullptr

Erasing a node with 1 child:

* make parent point to child
* delete middle node

