```c++
template <typename T>
ArrayList<T>::ArrayList(const ArrayList& rhs)
{
  data = nullptr; // avoid dangling pointer
  *this = rhs;    // invoke operator=
}
```