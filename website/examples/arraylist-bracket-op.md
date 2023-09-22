```c++
template <typename T>
T & ArrayList<T>::operator[](int index)
{
  // warning! no bounds-checking performed
  return data[index];
}

template <typename T>
T & ArrayList<T>::at(int index)
{
  if (0 <= index && index < num_elems)
    return data[index];
  else
    throw std::out_of_range("At: index out of range");
}
```