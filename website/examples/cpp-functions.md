```c++
#include <iostream>
using namespace std;

int addition(int a, int b)
{
  int r;
  r = a+b;
  return r;
}

int main()
{
  int z;
  z = addition(5,3)
  cout << "The result is " << z;

  return 0;
}
```
void functions
```c++
#include <iostream>
using namespace std;

void printmessage()
{
  cout << "I'm a function!";
}

int main()
{
  printmessage();

  return 0;
}
```
pass by reference
```c++
#include <iostream>
using namespace std;

void doubleVal(int &a, int&b, int &c)
{
  a*=2; b*=2; c*=2;
}

int main()
{
  int x=1, y=3, z=7;
 
  doubleVal(x, y, z);
  cout << "x=" << x
       << ", y=" << y
       << ", z=" << z;

  return 0;
}
```
default values
```c++
#include <iostream>
using namespace std;

int divide(int a, int b=2)
{
  int r;
  r=a/b;
  return r;
}

int main()
{
  cout << divide(12) << '\n';
       << divide(20,4) << '\n';

  return 0;
}
```
function prototypes
```c++
#include <iostream>
using namespace std;

void odd(int x);
void even(int x);  //Functions declared here ...

int main()
{
  int i;

  do
  {
    cout << "Enter a number (0 exits): ";
    cin >> i;
    odd(i);
  } while(i != 0);
  
  return 0;
}

void odd(int x)  //... and defined here!
{
  if(x%2 != 0)
    cout << "It is odd.\n";
  else even(x);
}

void even(int x)
{
  if(x%2 == 0)
    cout << "It is even.\n";
  else odd(x);
}
```