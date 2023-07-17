```c++
template <typename K, typename V>
void TreeMap<K,V>::clear(MapNode<K,V> *&root)
{
  if (root == nullptr) return;

  clear(root->m_right); // de-allocate right subtree
  clear(root->m_left);  // de-allocate left subtree
  delete root;          // de-allocate root
  root = nullptr;
}

template <typename K, typename V>
TreeMap<K,V>::~TreeMap()
{
  clear(m_root);
}