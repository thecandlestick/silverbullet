```c++
ListNode<T>* find( const T& x )
{
  ListNode<T> *p = m_head;
  while( p -> m_next != nullptr )
  {
    if (x == p -> m_data )
      return p;
    p = p -> m_next;
  }
  return nullptr;
}
```