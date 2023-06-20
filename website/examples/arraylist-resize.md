```c++
template <typename T>
void ArrayList<T>::resize(int new_capacity)
{
  //Allocate new storage array
  T* temp = new T[new_capacity];
  //Perform a deep copy of the data
  for(int k=0; k < size; k++)
    temp[k] = data[k];
  //De-allocate old storage array
  delete [] data;
  //Redirect data pointer
  data = tmp;
  //Update capacity
  capacity = new_capacity;
}
```