```c++
template <typename T>
const T& LinkedList<T>::get( LinkedListIterator<T> it )
{
  return it -> data;
}

template <typename T>
void LinkedList<T>::set( LinkedListIterator<T> it, const T& value )
{
  it -> data = value;
}
```