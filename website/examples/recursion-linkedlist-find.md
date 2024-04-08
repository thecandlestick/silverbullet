```c++
LinkedList<T>* LinkedList<T>::find(const T& value)
{
  if (data == value)
    return this;
  if (next == nullptr)
    return nullptr;

  return next->find(value);
  //(*next).find(value);
}
```