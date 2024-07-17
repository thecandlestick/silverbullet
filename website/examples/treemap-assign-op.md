```c++
template <typename K, typename V>
MapNode<K,V>* TreeMap<K,V>::clone(const MapNode<K,V>* root)
{
  if (root == nullptr)
    return nullptr;
  else
    return new MapNode<K,V>(root->key, root->value,
                    clone(root->left_st), clone(root->right_st));

  // Copy key/val from root then clone right/left subtrees
}

template <typename K, typename V>
TreeMap<K,V>& TreeMap<K,V>::operator=(const TreeMap<K,V> &rhs)
{
  clear(global_root);
  global_root = clone(rhs.global_root);
  return *this;
}
```