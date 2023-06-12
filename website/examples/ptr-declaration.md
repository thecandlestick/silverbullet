```c++
#include <iostream>
using namespace std;

int main()
{
  int x;
  float y = 3.14;
  float *p = &y; 

  // float *q = &x;   INVALID
  int *q = &x;

  // p = q;  INVALID
  int *s; s = q;

  // char *r;  UNKNOWN ADDRESS (DANGER!)
  char *r = nullptr;  // r points "nowhere" (Safe)

  return 0;
}