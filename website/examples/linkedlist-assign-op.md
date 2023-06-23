```c++
template <typename T>
const LinkedList<T>& operator=( const LinkedList<T> &rhs )
{
  clear(); //start by emptying list
  ListNode<T>* p = m_head;
  ListNode<T>* q = rhs.m_head;
  while ( q -> m_next != nullptr ) //use two pointers to deep copy
  {
    insert(p, q -> m_data);
    p = p -> m_next;
    q = q -> m_next;
  }
}
```