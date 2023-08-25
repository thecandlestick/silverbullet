

Date: 2023-08-25


Reminders:
* [ ]  

Objectives:
* [ ] Finish C++ Review
* [ ] Pointers

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
<!-- /include -->

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


# Memory Model

The programming in this course will have you directly manipulating _memory_. Before that, we first need to clarify what exactly we mean by _memory_. 

Your program, and any variables it creates, live in the memory of your computer. This memory is a limited resource. Use too much and the computer slows; use more than you have and the program crashes!

## Memory as a Tape

You can think of memory as a continuous tape of addressable _cells_

```c++
int x; float y = 3.14; char z = 'z';
```
| Addr. | 0x009 | 0x00A | 0x00B | 0x00C | ... |
|----------|----------|----------|----------|----------|----------|
| Value | ? | ‘z’ | ? | 3.14 | ... |
| Variable | x | z | | y | ... |


Of course, not all datum fit neatly into a fixed-size _cell_, but this model is good enough to discuss what happens during code execution.

## Memory Diagrams

When writing programs, we rarely concern ourselves with the underlying particulars of memory. Those details are abstracted away in high level programming languages.

A more common way of representing the state of memory is using _memory diagrams_.

[Visualizer](https://pythontutor.com/)
[“See”++](https://seepluspl.us/)

---

# Pointers in C++

A _pointer_ is a variable that stores a memory address

## Address-of (&) Operator

The & operator is used to obtain the memory address of an existing variable and is commonly used to initialize pointer variables.

<!-- #include [[examples/ptr-addr-of]] -->
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
<!-- /include -->


## Declaration

The standard syntax for declaring a pointer is
```<type> *<ptr-name>```

Note that pointers are only compatible with the specific type that they were declared for.

Uninitialized pointers are dangerous and a common source of bugs, it is therefore best practice to initialize pointers to the special value **nullptr** until it is ready for use.

<!-- #include [[examples/ptr-declaration]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int x;
  float y = 3.14;
  float *p = &y; 

  // float *q = &x;   INVALID
  int *q = &x;

  // p = q;  INVALID
  int *s; s = q;

  // char *r;  UNKNOWN ADDRESS (DANGER!)
  char *r = nullptr;  // r points "nowhere" (Safe)

  return 0;
}
<!-- /include -->


## De-reference (*) Operator

It is important to remember that a pointer stores _only_ the memory address of an object. If you need to access the value of that object, you must use the _De-reference (*)_ operator on the pointer. 

<!-- #include [[examples/ptr-dereference]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int x=0; z=4;
  float y = 3.14;

  int *q = &x, *s = &z;  // declaring two int-pointers, q & s 
  float *p = &y;

  cout << q << *q;  // <memory-address> 0
  *p = 2.345;   // y == 2.345
  *s = 3 + *q;  // z == ???
  *p = *q**s;   // y == ???

  return 0;
}
<!-- /include -->

_KC: What is the value of z after the code above is executed?_

