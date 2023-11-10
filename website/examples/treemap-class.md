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