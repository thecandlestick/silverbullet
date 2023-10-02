```c++
template <typename T>
void erase( LinkedListIterator<T> it )
{
  ListNode<T> *tmp = it -> next;
  it -> data = tmp -> data;
  it -> next = tmp -> next;
  delete tmp;
  size--;
}
```