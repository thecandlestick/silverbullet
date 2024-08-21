---
tags: template, cs1575-lecture-slides
sequence-number: 1
---

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