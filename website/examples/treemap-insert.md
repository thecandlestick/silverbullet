```c++
template <typename K, typename V>
void TreeMap<K,V>::insert_helper(MapNode<K,V> *&root, K new_key, V new_value)
{

  if (root == nullptr) // empty spot found! begin insertion
    root = new MapNode<K,V>(new_key, new_value);
  
  if (new_key == root->key)
    return; // no duplicates!
    // or throw exception
    
  else  // still looking for proper placement
  {
    if (new_key < root->key)
      insert_helper(root->left_st, new_key, new_value);
    else if (new_key > root->key)
      insert_helper(root->right_st, new_key, new_value);
  }

}
```