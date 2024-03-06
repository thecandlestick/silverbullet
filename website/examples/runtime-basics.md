```c++
template <typename T>
void ArrayList<T>::switch_elem(int i, int j)
{
  T tmp = data[i];  // 2 ops
  data[i] = data[j]; // 3 ops
  data[j] = tmp; // 2 ops
}

How many operations?
Ts_e(n) = 7
```