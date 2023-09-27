```c++
template <typename T>
void ArrayList<T>::insert(int index, const T& val)
{
  // Bounds-Checking
  if (0 <= index && index <= num_elems)
  {
    // Is storage array at capacity?
    if (num_elems == max_elems)
      reserve(max_elems*2);
    // Right-shift data to make room for insertion
    for(int k=num_elems; k > index; k--)
      data[k] = data[k-1];

    // Inserting desired value
    data[index] = val;
    num_elems++:
  }
  else
    throw std::out_of_range("Insert: index out of range");
}
```