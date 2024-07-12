```c++
template <typename K, typename V>
MapNode<K,V>* TreeMap<K,V>::find_helper(MapNode<K,V> *root, const K &search_key)
{
  if (root == nullptr)  // not found
    return nullptr;
  if (search_key == root->key) // found!
    return root;

  if (search_key < root->key)  // still searching ...
    return find_helper(root->left_st, search_key);

  return find_helper(root->right_st, search_key);
}
```