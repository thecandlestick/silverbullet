```c++
template <typename T>
void LinkedList<T>::clear()  //useful aux. function to have
{
  ListNode<T> *tmp;
  tmp = m_head -> m_next;
  while ( tmp != nullptr )
  {
    delete m_head;
    m_head = tmp;
    tmp = m_head -> m_next;
  }

  m_size = 0;
}

template <typename T>
LinkedList<T>::~LinkedList()
{
  clear()
  delete m_head;
}
```