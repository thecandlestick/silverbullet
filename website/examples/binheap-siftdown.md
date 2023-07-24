```c++
template <typename T>
void MaxBinaryHeap<T>::siftDown(int start_index)
{
  int curr_index = start_index;
  while( (2*curr_index +1) < m_size )  
  {
    int greater_child = 2*curr_index + 1;  // determine larger child
    if ((greater_child + 1 < m_size) 
        && (m_data[greater_child] < m_data[greater_child+1]))
      greater_child++;

    if ( m_data[curr_index] < m_data[greater_child] )
    {
      // swap if parent is smaller
      T temp = m_data[curr_index];
      m_data[curr_index] = m_data[greater_child];
      m_data[greater_child] = temp;
      curr_index = greater_child;
    }
    else
      return;
  }
}
```