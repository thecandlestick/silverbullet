
_Recursive_ Implementation
```c++
MapNode<K,V>* TreeMap<K,V>::getMax(MapNode<K,V> *root)
{
  if (root->m_right == nullptr)
    return root;
  return getMax(root->m_right);
}
```

_Iterative_ Implementation
```c++
MapNode<K,V>* TreeMap<K,V>::getMin(MapNode<K,V> *root)
{
  while (root->m_left != nullptr)
    root = root -> m_left;
  return root;
}
```