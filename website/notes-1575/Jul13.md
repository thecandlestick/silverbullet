

Date: 2023-07-13
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=64f3e0fb-7ec3-46d3-9659-b03e01374180

Reminders:
* [x] PA04 due tomorrow

Objectives:
* [x] Finish TreeMap

---

![](img%2Ftreemap-diagram.png)
## Erase

Erasing an element from a BST while maintaining the search property can be a challenging task. We will need to come up with three separate plans for removing nodes of degree 0, 1, and 2.

Erasing a leaf node:

* [x] sarah
* [x] garret h

Erasing a node with 1 child:

* [x] garret w

Erasing a node with 2 children:

  replace node with max of left subtree or min of right subtree

* [x] tony
* [x] ben
* [x] dheeraj
* [x] sarah
* [x] sarah

[[examples/treemap-erase]]

<!-- #include [[examples/treemap-erase]] -->
```c++
template <typename K, typename V>
void TreeMap<K,V>::erase(MapNode<K,V> *&root, const K &erase_key)
{
  /// Find node for erasure ///
  if (root == nullptr)
    return;

  if (erase_key < root->m_key)
    erase(root->m_left, erase_key)
  else if (erase_key > root->m_key)
    erase(root->m_right, erase_key)
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
      erase(root->m_left, successor->m_key); // eject the imposter
      //erase(root->m_right, successor->m_key);
    }

  }
}
```
<!-- /include -->

* [x] sarah

---

# Default Member Functions

![](img%2Ftreemap-diagram.png)

## Destructor

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

* [x] tony
* [x] garret w
* [x] sarah

KC: Is pre-order or post-order traversal better for clearing all data?

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


## Operator=

* [x] garret w
* [x] sarah

[[examples/treemap-assign-op]]
<!-- #include [[examples/treemap-assign-op]] -->
```c++
template <typename K, typename V>
MapNode<K,V>* TreeMap<K,V>::clone(const MapNode<K,V>* root)
{
  if (root == nullptr)
    return nullptr;
  else
    return new MapNode<K,V>(root->m_key, root->m_value,
                    clone(root->m_left), clone(root->m_right));

  // Copy key/val from root then clone right/left subtrees
}

template <typename K, typename V>
TreeMap<K,V>& TreeMap<K,V>::operator=(const TreeMap<K,V> &rhs)
{
  clear(m_root);
  m_root = clone(rhs->m_root);
  return *this;
}
```
<!-- /include -->


## Copy Constructor

[[examples/treemap-copy-constructor]]

<!-- #include [[examples/treemap-copy-constructor]] -->
```c++
template <typename K, typename V>
TreeMap<K,V>::TreeMap(const TreeMap<K,V> &rhs)
{
  m_root = nullptr;
  *this = rhs;
}
```
<!-- /include -->

# Object Oriented Programming

OOP is a _programming paradigm_ centered around the idea of organizing your code through _objects_. Objects are a coupling of data and the code that is meant to act on that data. (variables + functions)

## The 3 Pillars of OOP

There are three (generally) agreed upon aspects OOP design

* [[Encapsulation]]
* [[Inheritance]]
* [[Polymorphism]]


Different programming languages will express these ideas in different ways. Some languages may support only some aspects of OOP design, and others may be incompatible with OOP entirely.

