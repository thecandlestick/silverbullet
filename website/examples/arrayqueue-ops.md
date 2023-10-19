```c++
template <typename T>
T& ArrayQueue<T>::front()
{
  return m_data[m_front];
}

template <typename T>
void ArrayQueue<T>::enqueue(const T& value)
{
  if (m_front == m_back && m_size != 0)
    resize(2*m_capacity);
  m_data[m_back] = value;
  m_back = (m_back+1) % m_capacity; //wrap around if necessary
  size++;
}

template <typename T>
void ArrayQueue<T>::dequeue()
{
  if (m_size > 0)
  {
    m_front = (m_front+1) % m_capacity; //wrap around if necessary
    m_size--;
  }
  if (m_size < 0.25*m_capacity) // free memory if nearly empty
    resize(0.5*m_capacity);
}
```