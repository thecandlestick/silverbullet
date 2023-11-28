```c++
template <typename T>
void MaxBinaryHeap<T>::siftDown(int start_index)
{
  int curr_index = start_index;
  while( (2*curr_index +1) < num_elems )  // stop if curr_index is leaf
  {
    int greater_child = 2*curr_index + 1;  // determine larger child
    if ((greater_child + 1 < num_elems) 
        && (data[greater_child] < data[greater_child+1]))
      greater_child++;

    if ( data[curr_index] < data[greater_child] )
    {
      // swap if parent is smaller
      T temp = data[curr_index];
      data[curr_index] = data[greater_child];
      data[greater_child] = temp;
      curr_index = greater_child;
    }
    else
      return; // stop if max-heap property is satisfied
  }
}
```