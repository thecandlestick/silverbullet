

Date: 2023-08-28


Reminders:
* [ ]  

Objectives:
* [ ] Continue pointers

---



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

_KC: Which of the following is valid use of a pointer?_
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

<!-- #include [[examples/ptr-dereference]] -->
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
<!-- /include -->

_KC: What is the value of z after the code above is executed?_

## _const_ and Pointers

The _const_ keyword can be applied to pointers in two different ways. The _const_ can be applied to the type that the pointer points to, or it can be applied to the pointer itself. This gives, in total, four possible variations.

<!-- #include [[examples/ptr-const]] -->
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
<!-- /include -->


## Pointers as Parameters / RetVal

```c++
void foo( int *a );  // takes int pointer as arg
int* bar( char c );  // returns an int pointer
```

## Pointers & Arrays 

```c++
int *a[5]; // array of 5 integer pointers
```

<!-- #include [[examples/ptr-arrays]] -->
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
<!-- /include -->


## Pointers & Classes

When you have a pointer to a class object, the -> operator provides a convenient way to access member variables and member functions. 

```ptr -> mem``` _de-references_ **ptr**, and then accesses **mem**. This is useful because the “.” (access) operator happens before the * (de-reference) operator in terms of precedence.

<!-- #include [[examples/ptr-class]] -->
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
<!-- /include -->

---

# Dynamic Memory

Standard variables are created at _compile time_, but it is also possible to create variables on-demand during _run time_.

Variables created during run time have no name by which to refer to them. Instead, pointers are used to track and manage these _dynamic_ variables.

Standard variables exist in a part of memory known as the **stack**. Dynamic variables exist in a different part of memory known as the **heap.**

## _new_ Operator

(Dynamically) Allocates a new variable or array of variables to the heap and returns a pointer to it

```my_pointer = new <type>``` used for dynamic variables

```my_pointer = new <type>[<size>]``` for dynamic arrays

## _delete_ Operator

Unlike standard variables that get removed when leaving their scope, dynamic variables can persist indefinitely. It is therefore the _programmer’s_ responsibility to clean up after themselves. the _delete_ operator must be used to de-allocate a dynamic variable.

```delete <ptr>;```  used for dynamic variables

```delete [] <ptr>;```  used for dynamic arrays

Please note: _delete_ **DOES NOT** alter the pointer in any way. It **ONLY** de-allocates the memory used by the object being _pointed to_.
