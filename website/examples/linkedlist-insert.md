```c++
template <typename T>
void LinkedList<T>::insert(ListNode<T> *p, const T& x)
{
  ListNode<T> *tmp = new ListNode<T>;
  tmp -> m_data = p -> m_data;
  tmp -> m_next = p -> m_next;
  p -> m_data = x;
  p -> m_next = tmp;
  m_size++;
}
```