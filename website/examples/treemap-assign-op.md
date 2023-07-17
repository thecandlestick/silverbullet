```c++
template <typename K, typename V>
MapNode<K,V>* TreeMap<K,V>::clone(const MapNode<K,V>* root)
{
  if (root == nullptr)
    return nullptr;
  else
    return new MapNode<K,V>(root->m_key, root->m_value,
                    clone(root->m_left), clone(root->m_right));

  // Copy key/val from root then clone right/left subtrees
}

template <typename K, typename V>
TreeMap<K,V>& TreeMap<K,V>::operator=(const TreeMap<K,V> &rhs)
{
  clear(m_root);
  m_root = clone(rhs->m_root);
  return *this;
}
```