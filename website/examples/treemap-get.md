```c++
template <typename K, typename V>
V& MapNode<K,V>::at_helper(MapNode<K,V> *root, const K &access_key)
{
  MapNode<K,V> *access_node = find(access_key);
  if (access_node == nullptr)
    throw std::out_of_range("Key not found!");

  return access_node->value;
}
```