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