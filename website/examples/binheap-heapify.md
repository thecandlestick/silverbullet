```c++
template <typename T>
MaxBinaryHeap<T>::MaxBinaryHeap(T *newData, int len)
{
  m_data = nullptr;
  m_size = 0;
  m_capacity = 0;
  resize(len);
  m_size = len;

  for(int i = 0; i < m_size; i++)  // load data into heap
  {
      data[i] = newData[i];
  }
  
  int end = len - 1;
  int st = (end - 1) / 2;
  while(st >= 0)  // sift-down elements from level n-1 up to root
  {
      siftDown(st);
      st--;
  }

}
```