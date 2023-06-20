```c++
template <typename T>
void ArrayList<T>::remove(int i)
{  
  if ( 0 <= i && i < size )
  {
    for(int k=i; k < size-1 ; k++)
      data[k] = data[k+1];
    
    size--;
    if( size < capacity / 4 )
      resize(capacity / 2);
  }
  else
    // ...
}
```