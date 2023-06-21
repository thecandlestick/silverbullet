```c++
template <typename T>
const T& LinkedList<T>::get( ListNode<T> *p )
{
  return p -> m_data;
}

template <typename T>
void LinkedList<T>::set( ListNode<T> *p )
{
  p -> m_data = x;
}
```