```c++
template <typename T>
T& LinkedQueue<T>::front()
{
  return m_sentinel -> m_next -> m_data;
}

template <typename T>
void LinkedQueue<T>::enqueue(const T& value)
{
  QueueNode<T> *new_sentinel = new QueueNode<T>;
  new_sentinel -> m_next = m_sentinel -> m_next;  // point to front

  m_sentinel -> m_data = value;
  m_sentinel -> m_next = new_sentinel; // old sentinel becomes back

  m_sentinel = new_sentinel; // redirect m_sentinel pointer
  m_size++;
}

template <typename T>
void LinkedQueue<T>::dequeue()
{
  QueueNode<T> *tmp = m_sentinel -> m_next; // point to front
  m_sentinel -> m_next = tmp -> m_next; // remove front from chain
  delete tmp;
  m_size--;
}
```