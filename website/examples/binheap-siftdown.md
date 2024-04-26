```c++
template <typename T>
void MaxBinaryHeap<T>::siftDown(int start_index)
{
  int c_index = start_index;
  while( (2*c_index +1) < num_elems )  // stop if c_index is leaf
  {
    int max_child_index = 2*c_index + 1;  // determine larger child
    if ((max_child_index + 1 < num_elems) 
        && (data[max_child_index] < data[max_child_index+1]))
      max_child_index++;

    if ( data[c_index] < data[max_child_index] )
    {
      // swap if parent is smaller
      T temp = data[c_index];
      data[c_index] = data[max_child_index];
      data[max_child_index] = temp;
      
      c_index = max_child_index;
    }
    else
      return; // stop if max-heap property is satisfied
  }
}
```