```c++
template <typename T>
void MaxBinaryHeap<T>::push(const T& val)
{
  if (num_elems == max_elems)
    resize(max_elems*2);

  data[num_elems] = val;
  int curr = num_elems;
  while(curr > 0 && ((curr - 1) / 2) < curr)
  {
      if(data[curr] > data[(curr - 1) / 2])
      {
          T temp = data[curr];
          data[curr] = data[(curr - 1) / 2];
          data[(curr - 1) / 2] = temp;
      }
      curr = (curr-1)/2;
  }
  num_elems++;
}
```