```c++
template <typename K, typename V>
void TreeMap<K,V>::erase_helper(MapNode<K,V> *&root, const K &erase_key)
{
  /// Find node for erasure ///
  if (root == nullptr)
    return;

  if (erase_key < root->key)
    erase_helper(root->left_st, erase_key)
  else if (erase_key > root->key)
    erase_helper(root->right_st, erase_key)
  else
  {
  /// Node found, begin erasure ///
  
    /// Degree 0 ///
    if (root->left_st == nullptr && root->right_st == nullptr)
    {
      delete root;
      root = nullptr;
    }
    /// Degree 1 ///
    else if (root->left_st == nullptr)
    {
      MapNode<K,V> *child = root->right_st;
      delete root;
      root = child;
    }
    else if (root->right_st == nullptr)
    {
      MapNode<K,V> *child = root->left_st;
      delete root;
      root = child;
    }
  
    /// Degree 2 ///
    else
    {
      MapNode<K,V> *successor = getMax(root->left_st);
      //TreeMap<K,V> *successor = getMin(root->right_st);
      root->key = successor->key;
      root->value = successor->value;
      
      // Eject the imposter
      erase_helper(root->left_st, successor->key); 
      //erase_helper(root->right_st, successor->key);
    }

  }
}
```