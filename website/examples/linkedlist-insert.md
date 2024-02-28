```c++
template <typename T>
void LinkedList<T>::insert(LinkedListIterator<T> it, const T& value)
{
  ListNode<T> *tmp = new ListNode<T>; //create new node
  tmp -> data = it -> data; // copy values from it
  tmp -> next = it -> next;
  it -> data = value; // store val in node
  it -> next = tmp; // redirect it->next
  size++; // increment num_elems/size
}
```