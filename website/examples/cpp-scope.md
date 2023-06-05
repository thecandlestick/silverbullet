```c++
// "Global" Scope
#include <iostream>
using namespace std;

int main() 
{
  // "outer" scope
  int x = 10;
  int y = 20;
  {
    // {} defines "inner" scope
    int x;    
    x = 50;   //sets value for (inner) x
    y = 50;   //sets value for (outer) y
    cout << "inner block:\n"
         << "x: " << x << '\n'
         << "y: " << y << '\n';
  }
  cout << "outer block:\n"
       << "x: " << x << '\n'
       << "y: " << y << '\n';

  return 0;
}
```