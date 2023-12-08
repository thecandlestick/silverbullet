```c++
template <typename T>
const T& MaxBinaryHeap<T>::top()
{
  if (num_elems == 0)
    throw std::out_of_range("Top(): The heap is empty!");
  return data[0];
}
```