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