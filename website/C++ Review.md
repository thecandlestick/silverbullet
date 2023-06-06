
# Quick Review of C++

This course will use the C++ programming language for all coding assignments. _This class is programming intensive_, a strong grasp of C++ basics is expected.

**Topics:**
<!-- #query page where name =~ /cpp-/ select name order by lastModified -->
|name                     |
|-------------------------|
|examples/cpp-hello-world |
|examples/cpp-variables   |
|examples/cpp-io          |
|examples/cpp-conditionals|
|examples/cpp-loops       |
|examples/cpp-functions   |
|examples/cpp-scope       |
|examples/cpp-classes     |
|examples/cpp-overloading |
|examples/cpp-templates   |
|examples/cpp-arrays      |
|examples/cpp-operators   |
<!-- /query -->


---
## Hello World

<!-- #include [[examples/cpp-hello-world]] -->
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
<!-- /include -->

What is the purpose of _using namespace std_? 

---
## Variables

<!-- #include [[examples/cpp-variables]] -->
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
  int c{2};   //(Uniform Init)        initial value: 2
  int result; //                      initial value: ???

  a = a + b;  //(Assignment operator)
  result = a - c;

  std::cout << result;
  return 0;
}
```
<!-- /include -->


What is the initial value of _result?_ Why does this happen?

---
## Operators

<!-- #include [[examples/cpp-operators]] -->
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

```+ - * / %```

Compound Assignment Operators

```+= -= *= /=```

Increment and Decrement

```a++ b-- ++a --b```

Comparison Operators

```== != < > <= >=```

Logical Operators

```&& || !```
<!-- /include -->

And more!

---
## Input and Output

<!-- #include [[examples/cpp-io]] -->
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
<!-- /include -->


---
## Conditionals

<!-- #include [[examples/cpp-conditionals]] -->
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
<!-- /include -->

When are {} needed for conditionals?

---
## Loops

<!-- #include [[examples/cpp-loops]] -->
while loops
```c++
#include <iostream>
using namespace std;

int main()
{
  int n = 10;

  while( n>0 ) // check condition
  {
    cout << n << ", "; // execute body
    --n;
  }  // repeat

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
    cout << "Enter text: ";   // execute body 
    getline (cin, str);
    cout << "You entered: " << str << '\n';
  } while (str != "goodbye");  // check condition ; repeat

  return 0;
}
```
for loops
```c++
#include <iostream>
using namespace std;

int main()
{
  //      [1]    [2]  [3]
  for(int n=10; n>0; n--)  
  {  
    cout << n << ", ";  // [4]
  }
  //run [1], check [2], execute [4]/[3], check [2], execute [4]/[3]...
  
  cout << "liftoff!\n"
  return 0;
}
```
<!-- /include -->


---
## Functions

<!-- #include [[examples/cpp-functions]] -->
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
<!-- /include -->

---
## Scope

<!-- #include [[examples/cpp-scope]] -->
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
<!-- /include -->


What else in C++ (implicitly) creates a new scope?

---
## Arrays

<!-- #include [[examples/cpp-arrays]] -->
basics
```c++
#include <iostream>
using namespace std;

int main()
{
  int foo [] = {16, 2, 77, 40, 12071};
  int n, result = 0;

  for ( n=0 ; n<5 ; ++n )
  {
    result += foo[n];
  }
  cout << result;
  return 0;
}
```
arrays as parameters
```c++
#include <iostream>
using namespace std;

void printarray(int arg[], int length)
{
  for (int n=0; n<length; ++n)
    cout << arg[n] << ' ';
  cout << endl;
}

int main()
{
  int firstarray[] = {5, 10, 15};
  int secondarray[] = {2, 4, 6, 8, 10};
  printarray(firstarray, 3);
  printarray(secondarray, 5);

  return 0;
}
```
multidimensional arr
![2D Array](two-d-arr.png)
<!-- /include -->


---
## Classes

<!-- #include [[examples/cpp-classes]] -->
A typical class
```c++
class name_of_type
{
  public:
    // function prototypes here
  private:
    // member data here
};
```

```c++
#include <iostream>
using namespace std;

class Rectangle
{
  private:
    int width, height;
  public:
    void set_values(int, int);  
    //You don't have to give names to parameters in prototypes! 🤯
    int area() {return width*height;} //"inline" function
};

int main()
{
  Rectangle rect, rectb;
  rect.set_values(3, 4);
  rectb.set_values(5, 6);
  cout << "rect area: " << rect.area() << endl
       << "rectb area: " << rectb.area() << endl;
  return 0;
}

// <Return Type> <Namespace(class name)>::<Function>(<Parameters>)
void Rectangle::set_values(int x, int y)
{
  width = x;
  height = y;
}
```
<!-- /include -->

What would be the difference between 
```c++
void Rectangle::set_values(int x, int y);
//and
void Rectangle::set_values(int x, int y) const;
```

---
## Overloading

<!-- #include [[examples/cpp-overloading]] -->
```c++
#include <iostream>
using namespace std;

int sum(int a, int b)
{
  return a+b;
}

//same function/namespace, different parameters
double sum(double a, double b)
{
  return a+b;
}

int main()
{
  cout << sum(10, 20) << '\n'
       << sum(1.0, 1.5) << '\n';
  return 0;
}
```

```c++
//Assignment operator overload
Fraction& Fraction::operator=(const Fraction &rhs)
{
  Numerator = rhs.Numerator;
  Denominator = rhs.Denominator;
  return (*this);
}

Fraction f, g, h;
f = g = h;
```
<!-- /include -->

What is ```this``` and why do we return it?

---
## Templates

<!-- #include [[examples/cpp-templates]] -->
```c++
#include <iostream>
using namespace std;

template <typename T>
T sum(T a, T b)
{
  T result;
  result = a + b;
  return result;
}

int main()
{
  int i=5, j=6, k;
  double f=2.0, g=0.5, h;
  k=sum<int>(i, j);
  h=sum<double>(f, g);

  cout << k << endl;
  cout << h << endl;
  return 0;
}
```
<!-- /include -->

Is ```<int> / <double>``` necessary?