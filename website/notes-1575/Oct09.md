

Date: 2023-10-12


Reminders:
* [ ]  

Objectives:
* [ ] Continue Algo Complexity

---


## Runtime Functions

A **runtime function** is a function that, given the size of an input, approximates the number of _operations_ an algorithm will take to produce the output.

By operations, we mean any sufficiently small procedure that performs a single logical step in the execution. We make this definition to simply the math and to prevent loss of generality between different compilers, processor architectures, etc.
(_examples: + - / * % [] || && < > = == ..._)

For instance, we may have the following runtime functions for Algo A and Algo B:

```latex
  T_a(n) = 3n^2 + 6 \\
  T_b(n) = 0.05n^3 + 2
```
Measuring the number of operations where _n_ is the size of the input.

_size of input_ in this context can represent several things. What we really mean by it is anything that affects the number of operations required. This is can refer things such as the amount of data currently contained in a data structure or the number of bits in an integer input, for instance. Another consideration is that _size_ of input is not the only factor affecting runtime, two inputs of the same size can give drastically different results.


It’s for this reason that we typically disregard the _best-case scenario_ for inputs in favor of an _average-case_ or _worst-case_.

[[examples/runtime-basics]]

[[examples/runtime-branching]]

[[examples/runtime-looping]]

```c++
template <typename T>
bool ArrayList<T>::find( const T &value )
{
  //     Init ; Test ; Update
  for(int k=0; k < num_elements; k++)
    if ( data[k] == value ) // Loop Body
      return true; 
  
  return false;
}
```

RTF : Init + Σ(Body + Test + Update) = ?

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

RTF : 1 + Σ(Body + Test) = ?

```c++
int sum_sqrm(int a**, int n)  // return sum of n-by-n matrix
{
  int sum = 0;
  for (int k= 0; k < n; k++) // Outer Loop
  {
    for(int j=0; j < n; j++) // Inner Loop
      sum = sum + a[k][j];
  }
  return sum;
}
```

Cost of Inner : 1 + Σ(1 + 1 + 4) = 6n + 1
Cost of Outer : 1 + Σ(1 + 1 + 6n+1) = 6n^2 + 3n + 1

RTF : 6n^2 + 3n + 2


[[examples/runtime-logarithm]]

![](img%2FBinarySearch.png)
```c++
bool binarySearch(int A*, int n, int x) //find x in array A of size n
{
  int low = 0;
  int high = n-1;
  while (low <= high)
  {
    int mid = low + (high-low)/2; // start searching in the middle
    if (A[mid] == x)
      return true;
    else if (A[mid] < x) // x can't be "left"
      low = mid + 1;
    else
      high = mid - 1; // x can't be "right"
  }
}
```

How many times will the while loop iterate in terms of n?

RTF: 11 lg(n) + 3


If you want to analyze other characteristics, you just need to come up with an equivalent function representation. For example, a function that maps size of input to bytes of memory needed to produce the output would allow you to analyze memory consumption (or _space complexity_)

---
## Comparing Rate-of-Growth

Now that we have a way of representing algorithms as programs, we need a way of comparing them. As relying on our intuition to decide which is function is _better_ can be misleading.

![](img%2Frt-smallscale.png)
_ENHANCE!_

![](img%2Frt-largescale.png)

What we really value in algorithms is how well they _scale_ for large inputs. This due to a relatively simple law of algorithms: 
  
_For small inputs, the differences between Algo A and Algo B will generally be small as well. For large inputs the differences can be much greater, sometimes exponentially so!_ 

