```c++
template <typename K, typename V>
void TreeMap<K,V>::clear(MapNode<K,V> *&root)
{
  if (root == nullptr) return;

  clear(root->right_st); // de-allocate right subtree
  clear(root->left_st);  // de-allocate left subtree
  delete root;          // de-allocate root
  root = nullptr;
}

template <typename K, typename V>
TreeMap<K,V>::~TreeMap()
{
  clear(global_root);
}