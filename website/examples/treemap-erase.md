```c++
template <typename K, typename V>
void TreeMap<K,V>::erase_helper(MapNode<K,V> *&root, const K &erase_key)
{
  /// Find node for erasure ///
  if (root == nullptr)
    return;

  if (erase_key < root->m_key)
    erase_helper(root->m_left, erase_key)
  else if (erase_key > root->m_key)
    erase_helper(root->m_right, erase_key)
  else
  {
  /// Node found, begin erasure ///
  
    /// Degree 0 ///
    if (root->m_left == nullptr && root->m_right == nullptr)
      delete root;
      root = nullptr;
  
    /// Degree 1 ///
    else if (root->m_left == nullptr)
    {
      MapNode<K,V> *child = root->m_right;
      delete root;
      root = child;
    }
    else if (root->m_right == nullptr)
    {
      MapNode<K,V> *child = root->m_left;
      delete root;
      root = child;
    }
  
    /// Degree 2 ///
    else
    {
      MapNode<K,V> *successor = getMax(root->m_left);
      //TreeMap<K,V> *successor = getMin(root->m_right);
      root->m_key = successor->m_key;
      root->m_value = successor->m_value;
      
      // Eject the imposter
      erase_helper(root->m_left, successor->m_key); 
      //erase_helper(root->m_right, successor->m_key);
    }

  }
}
```