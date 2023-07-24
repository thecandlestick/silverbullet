```c++
template <typename T>
void MaxBinaryHeap<T>::push(const T& val)
{
  if (m_size == m_capacity)
    resize(m_capacity*2);

  m_data[m_size] = val;
  int curr = m_size;
  while(curr > 0 && ((curr - 1) / 2) < curr)
  {
      if(m_data[curr] > m_data[(curr - 1) / 2])
      {
          T temp = m_data[curr];
          m_data[curr] = m_data[(curr - 1) / 2];
          m_data[(curr - 1) / 2] = temp;
      }
      curr = (curr-1)/2;
  }
  m_size++;
}
```