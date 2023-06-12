```c++
#include <iostream>
using namespace std;

int main()
{
  int z[5];
  int *p, *q;

  p = &z[0];
  p = &z[2];

  q = z;      // pointers & arrays are "siblings"
  q[1] = 3;
  p[1] = 7;

  return 0;
}