```c++
#include <iostream>
using namespace std;

int main()
{
  int *p;
  // *p = 5;  Where is *p?

  p = new int[3];

  // p[10] = 7;      Invalid Write
  // int x = p[10];  Invalid Read
  delete [] p;
  // p[3] = 8;  Dangling Pointer!

  return 0;
}