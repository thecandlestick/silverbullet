```c++
LinkedList<T>::LinkedList(const LinkedList<T> &rhs)
{
  head = new ListNode<T>;
  head -> next = nullptr; //create sentinel node
  num_elems = 0; // set num elems
  *this = rhs; //invoke operator=
}
```