```c++
int foo(int n, int k)
{
  int x;
  if (n == 0) // 1 op
    x = 0;  // Block A
  else
  {  // Block B
    x = k*k; // 2
    x = x/n; // 2
  }
  return x;
}

How many operations in outer scope? 1
How many in Block A? 1
How many in Block B? 4

Best-Case RTF: 2
Worst-Case RTF: 5