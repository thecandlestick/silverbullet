```c++
template <typename K, typename V>
class MapNode
{
  private:
    K key;
    V value;
    MapNode<K,V> *left_st;
    MapNode<K,V> *right_st;
  
  public:
    // Node Constructors
    MapNode(K c_key, V val) : 
      key(c_key), value(val), left_st(nullptr), right_st(nullptr) {}
    MapNode(K c_key, V val, MapNode<K,V>* left, MapNode<K,V>* right) :
      key(c_key), value(val), left_st(left), right_st(right) {}

};
```

```c++
template <typename K, typename V>
class TreeMap
{
  private:
    MapNode<K,V> *global_root;  // Pointer to root node

    // Recursive operations, note: Private
    MapNode* find_helper(MapNode<K,V>* root, K key);
    V& at_helper(MapNode<K,V>* root, K key);
    void insert_helper(MapNode<K,V>*& root, K key, V val);
    void erase_helper(MapNode<K,V>*& root, K key);

    MapNode<K,V>* getMin(MapNode<K,V>* root);
    MapNode<K,V>* getMax(MapNode<K,V>* root);

  public:


    // Public functions to jump-start recursive operations
    MapNode* find(K key) {return find_helper(global_root, key);}
    V& at(K key) {return at_helper(global_root, key);}
    void insert(K key, V val) {insert_helper(global_root, key, val);}
    void erase(K key) {erase_helper(global_root, key, val);}
}
```

_Note on recursive operations:_

You may notice that there are two versions of each recursive operation. The reason for this is that for each recursive call we need to pass in the context of where we are in the tree structure (which MapNode) as parameter. However, the end-programmer does not know the memory address of the private variable _global_root_. 

Therefore, the public function is intended to _kick-start_ the recursion at the root of the tree and the private _helper function_ implements the actual recursive algorithm.