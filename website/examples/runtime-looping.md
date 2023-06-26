```c++
template <typename T>
bool ArrayList<T>::find( const T &x )
{
  //     Init ; Test ; Update
  for(int k=0; k < size; k++)
    if ( data[k] == x ) // Loop Body
      return true; 
  
  return false;
}
```

RTF : Init + Σ(Body + Test + Update) = ?

```c++
template <typename T>
ListNode<T>* LinkedList<T>::find( const T& x )
{
  ListNode<T> *p = m_head; // 1 op
  while( p -> m_next != nullptr )  // Test
  {  // Loop Body
    if (x == p -> m_data )
      return p;
    p = p -> m_next;
  }
  return nullptr;
}
```

RTF : 1 + Σ(Body + Test) = ?

```c++
int sum_sqrm(int a**, int n)  // return sum of n-by-n matrix
{
  int sum = 0;
  for (int k= 0; k < n; k++) // Outer Loop
  {
    for(int j=0; j < n; j++) // Inner Loop
      sum = sum += a[k][j];
  }
  return sum;
}
```

Cost of Inner : ? + Σ(?) = ?
Cost of Outer : ? + Σ(?) = ?

RTF : 