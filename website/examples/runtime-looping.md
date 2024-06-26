```c++
template <typename T>
bool ArrayList<T>::find( const T &value )
{
  //     Init ; Test ; Advance
  for(int k=0; k < num_elements; k++)
    if ( data[k] == value ) // Loop Body
      return true; 
  
  return false;
}
```

let n be num_elements

RTF : Init + Σ(Body + Test + Advance) = ?
RTF : 1 + num_elements(2 + 1 + 1) = 4n + 1



```c++
template <typename T>
ListNode<T>* LinkedList<T>::find( const T& value )
{
  ListNode<T> *p = head; // 1 op
  while( p -> next != nullptr )  // Test
  {  // Loop Body
    if (value == p -> data ) // 2 ops
      return p;
    p = p -> next; // 2 ops
  }
  return nullptr;
}
```

let n = num_elements

RTF : 1 + Σ(Body + Test) 
RTF : 1 + num_elements(4 + 2) = 6n + 1



```c++
int sum_sqrm(int a**, int n)  // return sum of n-by-n matrix
{
  int sum = 0; // 1 op
  for (int k= 0; k < n; k++) // Outer Loop
  {
    for(int j=0; j < n; j++) // Inner Loop
      sum += a[k][j]; // 3 ops
  }
  return sum;
}
```

Cost of Inner : 1 + n(3 + 1 + 1) = 5n + 1
Cost of Outer : 1 + n(5n + 1 + 1 + 1) = 5n^2 + 3n + 1

RTF : 5n^2 + 3n + 2