```c++
int foo(int n, int k)
{
  int x;
  if (n == 0)
    x = 0;  // Block A
  else
  {  // Block B
    x = k*k;
    x = x/n;
  }
  return x;
}

How many operations in outer scope?
How many in Block A?
How many in Block B?

Best-Case RTF:
Worst-Case RTF: