
_Recursive_ Implementation
```c++
MapNode<K,V>* TreeMap<K,V>::getMax(MapNode<K,V> *root)
{
  if (root->right_st == nullptr)
    return root;
  return getMax(root->right_st);
}
```

_Iterative_ Implementation
```c++
MapNode<K,V>* TreeMap<K,V>::getMin(MapNode<K,V> *root)
{
  while (root->left_st != nullptr)
    root = root -> left_st;
  return root;
}
```