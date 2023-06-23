```c++
template <typename T>
void erase( ListNode<T> *p )
{
  ListNode<T> *tmp = p -> m_next;
  p -> m_data = tmp -> m_data;
  p -> m_next = tmp -> m_next;
  delete tmp;
  m_size--;
}
```