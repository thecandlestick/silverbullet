![](img%2FBinarySearch.png)
```c++
bool binarySearch(int A*, int n, int x) //find x in array A of size n
{
  int low = 0; // 1 op
  int high = n-1; // 2 ops
  while (low <= high) // 1 op
  {
    // 4 ops
    int mid = low + (high-low)/2; // start searching in the middle
    if (A[mid] == x) // 2 ops
      return true;
      // 2 ops
    else if (A[mid] < x) // x can't be "left"
      low = mid + 1; // 2 ops
    else
      // 2 ops
      high = mid - 1; // x can't be "right"
  }
  return false;
}
```

How many times will the while loop iterate in terms of n?

let n be length of array

RTF: 3 + (11)lg(n)