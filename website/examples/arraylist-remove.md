```c++
void ArrayList::remove(int i)
{  
  if ( 0 <= i && i < size )
  {
    for(int k=i; k < size-1 ; k++)
      data[k] = data[k+1];
    
    size--;
    if( size < max / 4 )
      resize(max / 2);
  }
}
```