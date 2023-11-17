

Date: 2023-11-10


Reminders:
* [ ]  

Objectives:
* [ ] finish [[TreeMap]]

---


# TreeMap Class & Diagram

[[examples/treemap-class]]


![](img%2Ftreemap-diagram.png)


---

## Erase

Erasing an element from a BST while maintaining the search property can be a challenging task. We will need to come up with three separate plans for removing nodes of degree 0, 1, and 2.

Erasing a leaf node:

**remove the node**

Erasing a node with 1 child:

**choose child as successor**

Erasing a node with 2 children:

**choose max of left subtree or min of right subtree as successor**

[[examples/treemap-erase]]
<!-- #include [[examples/treemap-erase]] -->
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
<!-- /include -->


---

# Default Member Functions

## Destructor

_DQ: Is pre-order or post-order traversal better for clearing all data?_

[[examples/treemap-destructor]]
<!-- #include [[examples/treemap-destructor]] -->
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
<!-- /include -->



<!-- #include [[examples/pre-order-traversal]] -->
```
pre-order-print(root):
  print(root)
  for child in root.children()
    pre-order-print(child)
```
<!-- /include -->

<!-- #include [[examples/post-order-traversal]] -->
```
post-order-print(root):
  for child in root.children
    post-order-print(child)
  print(root)
```
<!-- /include -->

