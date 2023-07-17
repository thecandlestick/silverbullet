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