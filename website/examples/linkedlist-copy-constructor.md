```c++
LinkedList<T>::LinkedList(const LinkedList<T> &rhs)
{
  head = new ListNode<T>;
  head -> next = nullptr; //create sentinel node

  *this = rhs; //invoke operator=
}
```