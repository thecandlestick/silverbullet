```c++
template <typename T>
bool ArrayList<T>::find(const T &val)
{
  for(int k=0; k < num_elems; k++)
    if ( data[k] == val )
      return true; // val has been found
  
  return false;  // list does not contain val
}
```