```c++
template <typename T>
bool ArrayList<T>::find(const T &x)
{
  for(int k=0; k < size; k++)
    if ( data[k] == x )
      return true; // x has been found
  
  return false;  // list does not contain x
}
```