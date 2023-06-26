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

RTF: ?