```c++
template <typename T>
MaxBinaryHeap<T>::MaxBinaryHeap(T *newData, int len)
{
  data = nullptr;
  num_elems = 0;
  max_elems = 0;
  reserve(len);
  num_elems = len;

  for(int i = 0; i < num_elems; i++)  // load data into storage array
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