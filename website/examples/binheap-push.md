```c++
template <typename T>
void MaxBinaryHeap<T>::push(const T& val)
{
  if (num_elems == max_elems)
    reserve(max_elems*2);

  data[num_elems] = val; // start val at first-available space 
  int curr = num_elems;
  T temp;
  while(curr > 0 && (data[curr] > data[(curr - 1) / 2]))
  // sift-up to restore heap-property
  {
      temp = data[curr];
      data[curr] = data[(curr - 1) / 2];
      data[(curr - 1) / 2] = temp;
      curr = (curr-1)/2;
  }
  num_elems++;
}
```