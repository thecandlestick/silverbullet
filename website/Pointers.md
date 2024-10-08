---
tags: template
hooks.snippet.slashCommand: pointers
---

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

[[examples/ptr-addr-of]]
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
```

## Declaration

The standard syntax for declaring a pointer is
```<type> *<ptr-name>```

Note that pointers are only compatible with the specific type that they were declared for.

Uninitialized pointers are dangerous and a common source of bugs, it is therefore best practice to initialize pointers to the special value **nullptr** until it is ready for use.

[[examples/ptr-declaration]]
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
```

_#KnowledgeCheck: Which of the following is valid use of a pointer?_
```c++
int var1 = 42;
char var2 = 'h';
char *ptr1;
int *ptr2, *ptr3;

ptr1 = &var1;  // Option A
ptr1 = &var2;  // Option B
ptr2 = &ptr3;  // Option C
ptr3 = var1;   // Option D
```

## De-reference (*) Operator

It is important to remember that a pointer stores _only_ the memory address of an object. If you need to access the value of that object, you must use the _De-reference (*)_ operator on the pointer. 

[[examples/ptr-dereference]]
```c++
#include <iostream>
using namespace std;

int main()
{
  int x=0; z=4;
  float y = 3.14;

  int *q = &x, *s = &z;
  float *p = &y;

  cout << q << *q;  // <memory-address> 0
  *p = 2.345;   // y == 2.345
  *s = 3 + *q;  // z == ???
  *p = *q**s;   // y == ???

  return 0;
}
```

_#KnowledgeCheck: What is the value of z after the code above is executed?_

## _const_ and Pointers

The _const_ keyword can be applied to pointers in two different ways. The _const_ can be applied to the type that the pointer points to, or it can be applied to the pointer itself. This gives, in total, four possible variations.

[[examples/ptr-const]]
```c++
#include <iostream>
using namespace std;

int main()
{
  int x = 3;
  const int y = 7;

  int *p;                   // non-const ptr to non-const var
  const int *q;             // non-const ptr to const var
  int * const r = &x;       // const ptr to non-const var
  const int * const s = &y;  // const ptr to const var

  p = &x;
  // p = &y;  INVALID
  q = &y;
  q = &x;
  //*q = 13;  INVALID, q treats x as const when de-referenced
  *r = 4;
  //r = &y;  INVALID
  
return 0;
}
```


## Pointers as Parameters / RetVal

```c++
void foo( int *a );  // takes int pointer as arg
int* bar( char c );  // returns an int pointer
```

## Pointers & Arrays 

```c++
int *a[5]; // array of 5 integer pointers
```

[[examples/ptr-arrays]]
```c++
#include <iostream>
using namespace std;

int main()
{
  int z[5];
  int *p, *q;

  p = &z[0];
  p = &z[2];

  q = z;      // pointers & arrays are "siblings"
  q[1] = 3;
  p[1] = 7;

  return 0;
}
```

## Pointers & Classes

When you have a pointer to a class object, the -> operator provides a convenient way to access member variables and member functions. 

```ptr -> mem``` _de-references_ **ptr**, and then accesses **mem**. This is useful because the “.” (access) operator happens before the * (de-reference) operator in terms of precedence.

[[examples/ptr-class]]
```c++
#include <iostream>
#include <string>
using namespace std;

class Tiger
{
  string name;
  int *q;
};

class Fish
{
  private:
    int x;
    float s;
  public:
    void swim() { cout << "just keep swimming ... "; }
};

int main()
{
  Fish Nemo;
  Fish* p = &Nemo;
  
  // *p.x = 3;  INVALID! p has no member x
  (*p).x = 3;   // Valid, access member x of *p
  p -> s = 1.61;  // Valid, access member s of *p
  p -> swim();

  return 0;
}
```


---
[[Dynamic Memory]]