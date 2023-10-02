```c++
template <typename T>
void LinkedList<T>::insert(LinkedListIterator<T> it, const T& value)
{
  ListNode<T> *tmp = new ListNode<T>;
  tmp -> data = it -> data;
  tmp -> next = it -> next;
  it -> data = value;
  it -> next = tmp;
  size++;
}
```