```c++
LinkedList<T>::LinkedList(const LinkedList<T> &rhs)
{
  m_head = new ListNode;
  m_head -> m_next = nullptr; //create sentinel node

  *this = rhs; //invoke operator=
}
```