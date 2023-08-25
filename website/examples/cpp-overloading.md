```c++
#include <iostream>
using namespace std;

int sum(int a, int b)
{
  return a+b;
}

//same function/namespace, different parameters
double sum(double a, double b)
{
  return a+b;
}

int main()
{
  cout << sum(10, 20) << '\n'
       << sum(1.0, 1.5) << '\n';
  return 0;
}
```
