```c++
template <typename T>
const ArrayList& ArrayList<T>::operator=(const ArrayList& rhs)
{
  if (this != &rhs) // A = A;
  {
    T *tmp = new T[rhs.max_elems];  // allocate enough space

    for(int k=0; k < rhs.num_elems; k++)
      tmp[k] = rhs.data[k];  // deep copy

    max_elems = rhs.max_elems;
    num_elems = rhs.num_elems;
    delete [] data;  // de-allocate old data
    data = tmp;  // redirect data pointer
  }

  return (*this);  // return calling object
}
```