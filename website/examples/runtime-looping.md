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



```c++
template <typename T>
ListNode<T>* LinkedList<T>::find( const T& value )
{
  ListNode<T> *p = head; // 1 op
  while( p -> next != nullptr )  // Test
  {  // Loop Body
    if (value == p -> data ) 
      return p;
    p = p -> next; 
  }
  return nullptr;
}
```

let n = num_elements

RTF : 1 + Σ(Body + Test) 



```c++
int sum_sqrm(int a**, int n)  // return sum of n-by-n matrix
{
  int sum = 0;
  for (int k= 0; k < n; k++) // Outer Loop
  {
    for(int j=0; j < n; j++) // Inner Loop
      sum += a[k][j];
  }
  return sum;
}
```

Cost of Inner : 
Cost of Outer : 

RTF : 