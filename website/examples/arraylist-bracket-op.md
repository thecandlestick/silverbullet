```c++
template <typename T>
T & ArrayList<T>::operator[](int i)
{
  // warning! no bounds-checking performed
  return data[i];
}