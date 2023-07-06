```c++
int LinkedList<T>::size()
{
  if (m_next == nullptr)
    return 1;

  return 1 + m_next->size();
}
```