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

_Note on recursive operations:_

You may notice that there are two versions of each recursive operation. The reason for this is that for each recursive call we need to pass in the context of where we are in the tree structure (which MapNode) as parameter. However, the end-programmer does not know the memory address of the private variable _m_root_. 

Therefore, the public function is intended to _kick-start_ the recursion at the root of the tree and the private _helper function_ implements the actual recursive algorithm.