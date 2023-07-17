```c++
template <typename K, typename V>
TreeMap<K,V>::TreeMap(const TreeMap<K,V> &rhs)
{
  m_root = nullptr;
  *this = rhs;
}
```