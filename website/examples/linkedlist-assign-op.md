```c++
template <typename T>
LinkedList<T>& operator=( const LinkedList<T> &rhs )
{
  clear(); //start by emptying list
  ListNode<T>* pos_ptr = head;
  ListNode<T>* data_ptr = rhs.head;
  while ( data_ptr->next != nullptr ) //use two pointers to deep copy
  {
    insert(pos_ptr, data_ptr->data);
    pos_ptr = pos_ptr -> next;
    //pos_ptr = (*pos_ptr).next;
    data_ptr = data_ptr -> next;
  }

  return *this; // return calling obj
}
```