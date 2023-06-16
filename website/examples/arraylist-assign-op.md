```c++
template <typename T>
const ArrayList& ArrayList<T>::operator=(const ArrayList& rhs)
{
  if (this != &rhs)
  {
    T *tmp = new T[rhs.max];  // allocate enough space for rhs data
    for(int k=0; k < rhs.size; k++)
      tmp.data[k] = rhs.data[k];  // deep copy
    max = rhs.max;
    size = rhs.size;
    delete [] data;  // de-allocate old data
    data = tmp;
  }

  return (*this);
}
```