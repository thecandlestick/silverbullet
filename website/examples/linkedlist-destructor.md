```c++
template <typename T>
void LinkedList<T>::clear()  //useful aux. function to have
{
  ListNode<T> *tmp;
  tmp = head -> next;
  while ( tmp != nullptr )
  {
    delete head;
    head = tmp;
    tmp = head -> next;
  }

  num_elems = 0;
}

template <typename T>
LinkedList<T>::~LinkedList()
{
  clear();
  delete head;
}
```