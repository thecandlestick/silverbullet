```c++
template <typename T>
void MaxBinaryHeap<T>::pop()
{
  if(num_elems == 0)
    throw std::out_of_range("Can't pop empty heap");
  
  data[0] = data[num_elems - 1]; // Swap root with last element
  num_elems--; // Remove last element
  siftdown(0); // Restore heap property

  if (num_elems < max_elems / 4)
    shrink_to_fit();
}
```