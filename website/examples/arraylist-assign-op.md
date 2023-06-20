```c++
template <typename T>
const ArrayList& ArrayList<T>::operator=(const ArrayList& rhs)
{
  if (this != &rhs)
  {
    T *tmp = new T[rhs.capacity];  // allocate enough space

    for(int k=0; k < rhs.size; k++)
      tmp.data[k] = rhs.data[k];  // deep copy

    capacity = rhs.capacity;
    size = rhs.size;
    delete [] data;  // de-allocate old data
    data = tmp;  // redirect data pointer
  }

  return (*this);  // return calling object
}
```