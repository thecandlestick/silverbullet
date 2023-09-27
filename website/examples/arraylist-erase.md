```c++
template <typename T>
void ArrayList<T>::erase(int index)
{  
  // Bounds-checking
  if ( 0 <= index && index < num_elems )
  {
    // Left-shift data to overwrite unwanted data
    for(int k=index; k < num_elems-1 ; k++)
      data[k] = data[k+1];
    
    num_elems--;
  }
  else
    throw std::out_of_range("Erase: index out of range");
}
```