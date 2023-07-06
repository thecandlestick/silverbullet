```c++
LinkedList<T>* LinkedList<T>::find(const T& value)
{
  if (m_data == value)
    return this;
  if (m_next == nullptr)
    return nullptr;

  return m_next->find(value);
}
```