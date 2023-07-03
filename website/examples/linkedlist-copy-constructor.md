```c++
LinkedList<T>::LinkedList(const LinkedList<T> &rhs)
{
  m_head = new ListNode<T>;
  m_head -> m_next = nullptr; //create sentinel node

  *this = rhs; //invoke operator=
}
```