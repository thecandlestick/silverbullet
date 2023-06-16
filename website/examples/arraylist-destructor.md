```c++
template <typename T>
ArrayList<T>::~ArrayList()
{
  delete [] data;
}
```