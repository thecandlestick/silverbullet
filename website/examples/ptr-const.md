```c++
#include <iostream>
using namespace std;

int main()
{
  int x = 3;
  const int y = 7;

  int *p;                   // non-const ptr to non-const var
  const int *q;             // non-const ptr to const var
  int * const r = &x;       // const ptr to non-const var
  const int const *s = &y;  // const ptr to const var

  p = &x;
  // p = &y;  INVALID
  q = &y;
  q = &x;
  //*q = 13;  INVALID, q treats x as const when de-referenced
  *r = 4;
  //r = &y;  INVALID
  
return 0;
}