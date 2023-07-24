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

[[examples/treemap-get-max-min]]

## Find

It makes sense to start with _find_ because we don’t directly know where everything is in a BST

[[examples/treemap-find]]

## Get/Set

[[examples/treemap-get]]

## Insert

KC: For args passed to functions, what is the difference between: 
  * MapNode *
  * MapNode *&

[[examples/treemap-insert]]

## Erase

Erasing an element from a BST while maintaining the search property can be a challenging task. We will need to come up with three separate plans for removing nodes of degree 0, 1, and 2.

Erasing a leaf node:

Erasing a node with 1 child:

Erasing a node with 2 children:

[[examples/treemap-erase]]


---

# Default Member Functions

## Destructor

KC: Is pre-order or post-order traversal better for clearing all data?

[[examples/treemap-destructor]]

## Operator=

[[examples/treemap-assign-op]]

## Copy Constructor

[[examples/treemap-copy-constructor]]