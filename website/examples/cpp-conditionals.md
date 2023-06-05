```c++
#include <iostream>
using namespace std;

int main()
{
  int x;

  cout << "Please enter an integer value: ";
  cin >> x;

  if(x > 0)
    cout << "x is positive";
  else if(x < 0)
    cout << "x is negative";
  else
  {
    cout << "x is 0" << endl;
    cout << "0 is neither positive nor negative!";    
  }

  return 0;
}
```