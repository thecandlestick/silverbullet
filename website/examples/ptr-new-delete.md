```c++
#include <iostream>
using namespace std;

int main()
{
  int x, y;
  int *p = new int;
  cin >> x;
  int *q = new int[x];
  Fish *f = new Fish;

  delete p;     // p = nullptr;
  delete [] q;  // q = nullptr;
  delete f;     // f = nullptr;

  return 0;
}