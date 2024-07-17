```c++
template <typename K, typename V>
TreeMap<K,V>::TreeMap(const TreeMap<K,V> &rhs)
{
  global_root = nullptr;
  *this = rhs;
}
```