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