It can be sometimes be difficult to envision where your code will go in a recursive algorithm, but we can easily keep track by remembering the call-stack.

This example uses the [[examples/recursion-exponentiation]] algorithm
```c++
int main()
{
  int n;
  n = recursive_exp(2, 7);
  std::cout<< n << std::endl;

  return 0;
}
```

![tracing recursion](img/tracing-recursion.png)