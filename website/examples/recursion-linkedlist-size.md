```c++
int LinkedList<T>::size()
{
  if (next == nullptr)
    return 1;

  return 1 + next->size();
}
```