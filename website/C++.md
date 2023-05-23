
# Quick Review of C++

This course will use the C++ programming language for all coding assignments. _This class is programming intensive_, a strong grasp of C++ basics is expected.

---
## Hello World

```c++
#include <iostream>

int main()
{
  std::cout << "Hello, world!";
  return 0;
}
```

```c++
#include <iostream>
using namespace std;

int main()
{
  cout << "Hello, world!";
  return 0;
}
```

What is the purpose of _using namespace std_? 

---
## Variables

```c++
#include <iostream>

int main() 
{
  int a, b;
  int result;
  
  a = 5;
  b = 2;
  a = a + 1;
  result = a - b;

  std::cout << result; 
  return 0;
}
```

```c++
#include <iostream>

int main()
{
  int a=5;    //(Copy Constructor)    initial value: 5
  int b(3);   //(Copy Constructor)    initial value: 3
  int c{2};   //(Initialization List) initial value: 2
  int result; //                      initial value: ???

  a = a + b;  //(Assignment operator)
  result = a - c;

  std::cout << result;
  return 0;
}
```

What is the initial value of _result?_ Why does this happen?

---
## Operators

```c++
#include <iostream>

int main()  //The Assignment Operator (operator=)
{
  int a, b;    // a:?,  b:?
  a = 10;      // a:10, b:?
  b = 4;       // a:10, b:4
  a = b;       // a:4,  b:4
  b = 7;       // a:4,  b:7

  std::cout << "a: " << a << std::endl
            << "b: " << b << std::endl;
  //Your whitespace has no power here!
  return 0;
}
```

Arithmetic Operators
Compound Assignment Operators
Increment and Decrement
Comparison Operators
Logical Operators

---
## Input and Output

```c++
#include <iostream>
using namespace std;

int main() 
{
  int i;
  cout << "Please enter an integer value: ";
  cin >> i;
  cout << "The value you entered is " << i;
  cout << "and double is " << i*2 << endl;

  return 0;
}
```

```c++
#include <iostream>
#include <string>
using namespace std;

int main()
{
  char initials[2];
  string mystr;

  cout << "What are your initials? ";
  cin.get(initials,2);  //read arbitrary # of characters
  cout << "Hello " << intials << endl;

  cout<< "What is your favorite food?";
  getline(cin, mystr);  //read one "line" of input
  cout << "You like " << mystr << endl;

  return 0;
}
```

---
## Conditionals

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

Curly-brackets{} are only needed for multi-line conditional blocks

---
## Loops

while loops
```c++
#include <iostream>
using namespace std;

int main()
{
  int n = 10;

  while( n>0 )
  {
    cout << n << ", ";
    --n;
  }

  cout << "liftoff! \n"
  return 0;
}
```
do-while loops
```c++
#include <iostream>
#include <string>
using namespace std;

int main()
{
  string str;
  do 
  {
    cout << "Enter text: ";
    getline (cin, str);
    cout << "You entered: " << str << '\n';
  } while (str != "goodbye");

  return 0;
}
```
for loops
```c++
#include <iostream>
using namespace std;

int main()
{
  for(int n=10; n>0; n--)
  {
    cout << n << ", ";
  }
  cout << "liftoff!\n"

  return 0;
}
```

---
## Functions

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

---
## Multiple Files

<>

---
## Scope

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

What else in C++ (implicitly) creates a new scope?

---
## Arrays

basics
```c++
#include <iostream>
using namespace std;

int main()
{

  return 0;
}
```
arrays as parameters
```c++
#include <iostream>
using namespace std;

int main()
{

  return 0;
}
```
multidimensional arr
```c++
#include <iostream>
using namespace std;

int main()
{

  return 0;
}
```

---
## Structs


---
## Classes


---
## Overloading


---
## Templates