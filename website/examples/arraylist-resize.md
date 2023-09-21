```c++
// Allocates a larger storage array
template <typename T>
void ArrayList<T>::reserve(int new_capacity)
{
  //Allocate new storage array
  T* temp = new T[new_capacity];
  //Perform a deep copy of the data
  for(int k=0; k < num_elems; k++)
    temp[k] = data[k];
  //De-allocate old storage array
  delete [] data;
  //Redirect data pointer
  data = tmp;
  //Update capacity
  max_elems = new_capacity;
}

// Releases ALL unused memory
void ArrayList<T>::shrink_to_fit()
{
  //Allocate new storage array
  T* temp = new T[num_elems];
  //Perform a deep copy of the data
  for(int k=0; k < num_elems; k++)
    temp[k] = data[k];
  //De-allocate old storage array
  delete [] data;
  //Redirect data pointer
  data = tmp;
  //Update capacity
  max_elems = num_elems;
}
```