```c++
#include <iostream>
using namespace std;

int main()
{
  int *p;

  for( int r=0; r < 10; r++ )
    p = new int[10];  // AAAA! Memory Leak!

  return 0;
}