```c++
template <typename T>
void ArrayList<T>::insert(int i, const T& x)
{
  if (0 <= i && i <= size)
  {
    if (size == max)
      resize(max*2);
    for(int k=size; k > i; k--)
      data[k] = data[k-1];
    
    data[i] = x;
    size++:
  }
  else
    // ...
}
```