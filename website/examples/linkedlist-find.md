```c++
template <typename T>
ListNode<T>* find( const T& value )
{
  ListNode<T> *runner = head;
  while( runner -> next != nullptr )
  {
    if (value == runner -> data )
      return runner;
    runner = runner -> next;
  }
  return nullptr; // value was not found
}
```