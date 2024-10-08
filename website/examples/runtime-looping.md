When analyzing code involving loops, it can be helpful to first calculate the cost of a single iteration

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

let n be num_elems

RTF : Init + Σ(Body + Test + Advance) = 1 + num_elems(1 + 1 + 2)
RTF : ==4n + 1==



```c++
template <typename T>
ListNode<T>* LinkedList<T>::find( const T& value )
{
  ListNode<T> *p = head; // 1
  while( p -> next != nullptr )  // Test (2 ops)
  {  // Loop Body
    if (value == p -> data ) // 2 ops
      return p;
    p = p -> next; // 2 ops
  }
  return nullptr;
}
```

let n be num_elems

RTF : 1 + Σ(Body + Test) 
RTF : 1 + num_elems(2 + 4) = ==6n + 1==


Nested loops should be analyzed “from the inside to the outside”

```c++
int sum_sqrm(int a**, int n)  // return sum of n-by-n matrix
{
  int sum = 0; // 1
  for (int k= 0; k < n; k++) // Outer Loop
  {
    for(int j=0; j < n; j++) // Inner Loop
      sum += a[k][j]; // ?
  }
  return sum;
}
```

Cost of Inner : 1 + n(1 + 1 + 4) = 6n + 1
Cost of Outer : 1 + n(1 + 1 + 6n+1) = 6n^2 + 3n + 1

RTF : ==6n^2 + 3n + 2==