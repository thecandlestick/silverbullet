```c++
#include <iostream>
using namespace std;

int main()
{
  int x;
  float y = 3.14;

  cout << x << &x << endl  // <unknown int> <memory-address>
       << y << &y;         // 3.14 <memory-address>

  return 0;
}