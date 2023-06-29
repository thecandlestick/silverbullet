

Date: 2023-06-27
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=d704704f-f289-4b52-874f-b02e013d5817

Reminders:
* [ ] PA02 due TOMORROW

Objectives:
* [ ] Continue algo complexity

---

* [ ] sarah
* [ ] ben n
* [ ] tony
* [ ] ben w
* [ ] sarah
* [ ] matt
* [ ] garret w

[[examples/runtime-looping]]


```c++
template <typename T>
ListNode<T>* LinkedList<T>::find( const T& x )
{
  ListNode<T> *p = m_head; // 1 op
  while( p -> m_next != nullptr )  // Test (2)
  {  // Loop Body
    if (x == p -> m_data ) // 2 op, always false
      return p;
    p = p -> m_next; // 2
  }
  return nullptr;
}
```

* [ ] sarah
* [ ] tony

_let n = size of linkedlist_
RTF : 1 + Σ(Body + Test) = 1 + size*(4 + 2) = 6n + 1


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
Cost of Outer : 1 + Σ(1 + 1 + Inner) = 1 + 6n^2 + 3n

RTF : Tsum(n) = 6n^2 + 3n + 2

* [ ] garret h
* [ ] makalyn

[[examples/runtime-logarithm]]


![](img%2FBinarySearch.png)
```c++
bool binarySearch(int A*, int n, int x) //find x in array A of size n
{
  int low = 0;
  int high = n-1;
  while (low <= high) // 1
  {
    int mid = low + (high-low)/2; // 4 start searching in the middle
    if (A[mid] == x) // 2
      return true;
    else if (A[mid] < x) // 2 x can't be "left"
      low = mid + 1;
    else
      high = mid - 1; // 2 x can't be "right"
  }
  return false;
}
```

How many times will the while loop iterate in terms of n? **lg(n)**

n = 16
16 8 4 2 ~ 2^4 2^3 2^2 2^1

RTF: TbinS(n) = lg(n)* 11 + 3

* [ ] garret w
* [ ] makalyn

If you want to analyze other characteristics, you just need to come up with an equivalent function representation. For example, a function that maps size of input to bytes of memory needed to produce the output would allow you to analyze memory consumption (or _space complexity_)

---
## Comparing Rate-of-Growth

Now that we have a way of representing algorithms as programs, we need a way of comparing them. As relying on our intuition to decide which is function is _better_ can be misleading.

![](img%2Frt-smallscale.png)
_ENHANCE!_

![](img%2Frt-largescale.png)

What we really value in algorithms is how well they _scale_ for large inputs. This due to a relatively simple law of algorithms: 
  
_For small inputs, the differences between Algo A and Algo B will generally be small as well. For large inputs the differences can be much greater, sometimes exponentially so!_ 

The essential characteristic we need to extract from these functions is their **rate-of-growth**. Luckily, we have a collection of mathematical tools to do just that.

