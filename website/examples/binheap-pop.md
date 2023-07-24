```c++
template <typename T>
void MaxBinaryHeap<T>::pop()
{
  if(m_size == 0)
    throw std::out_of_range("Can't pop empty heap");
  
  m_data[0] = m_data[m_size - 1]; // Swap root with last element
  m_size--; // Remove last element
  siftdown(0); // Restore heap property

  if (m_size < m_capacity / 4)
    shrink();
}
```