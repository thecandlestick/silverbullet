Programs that include branching (if statements) can produce different runtime functions depending on which block of code is executed.

When analyzing branching code, it’s best to consider the _worst-case_ scenario

```c++
int foo(int n, int k)
{
  int x; // no ops
  if (n == 0) // 1
    x = 0;  // Block A
  else
  {  // Block B
    x = k*k; // 2
    x = x/n; // 2
  }
  return x; // no ops
}

How many operations in outer scope? 1 
How many in Block A? 1
How many in Block B? 4

Best-Case RTF: 2
Worst-Case RTF: 5