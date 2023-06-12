```c++
#include <iostream>
using namespace std;

int main()
{
  int x = 3;
  const int y = 7;

  int *p;
  const int *q;
  int const *r = &x;
  const int const *s = &y;

  p = &x;
  // p = &y;  INVALID
  q = &x;
  q = &y;
  //*q = 13;  INVALID
  *r = 4;
  //r = &y;  INVALID
  
return 0;
}