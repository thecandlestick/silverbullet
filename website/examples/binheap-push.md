```c++
template <typename T>
void MaxBinaryHeap<T>::push(const T& val)
{
  if (num_elems == max_elems)
    reserve(max_elems*2);

  data[num_elems] = val; // start val at first-available space 
  int c_index = num_elems;
  T temp;
  while(c_index > 0 && (data[c_index] > data[(c_index - 1) / 2]))
  // sift-up to restore heap-property
  {
      temp = data[c_index];
      data[c_index] = data[(c_index - 1) / 2];
      data[(c_index - 1) / 2] = temp;
      
      c_index = (c_index - 1)/2;
  }
  num_elems++;
  
}
```