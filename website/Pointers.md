
# Memory Model

The programming in this course will have you directly manipulating _memory_. Before that, we first need to clarify what exactly we mean by _memory_. 

Your program, and any variables it creates, live in the memory of your computer. This memory is a limited resource. Use too much and the computer slows; use more than you have and the program crashes!

## Memory as a Tape

You can think of memory as a continuous tape of addressable _cells_

```c++
int x = 0; float y = 3.14; char z = 'z';
```
| Addr. | 0x009 | 0x00A | 0x00B | 0x00C | ... |
|----------|----------|----------|----------|----------|----------|
| Value | 0 | ‘z’ | ? | 3.14 | ... |
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


## _const_ and Pointers

<!-- #include [[examples/ptr-const]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int x = 3;
  const int y = 7;

  int *p;
  const int *q;
  int const *r = &x;
  const int const *s = &y;

  p = &x;
  // p = &y;  INVALID
  q = &x;
  q = &y;
  //*q = 13;  INVALID
  *r = 4;
  //r = &y;  INVALID
  
return 0;
}
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
  
  // *p.x = 3;  INVALID
  (*p).x = 3;
  p -> s = 1.61;
  p -> swim();

  return 0;
}
<!-- /include -->

---

# Dynamic Memory

Standard variables are created at _compile time_, but it is also possible to create variables on-demand during _run time_.

Variables created during run time have no name by which to refer to them. Instead, pointers are used to track and manage these _dynamic_ variables.

## _new_ Operator

(Dynamically) Allocates a new variable or array of variables and returns a pointer to it

```my_pointer = new <type>```

## _delete_ Operator

Unlike standard variables that get removed when leaving their scope, dynamic variables can persist until the program completes. It is therefore the _programmer’s_ responsibility to clean up after themselves. the _delete_ operator must be used to de-allocate a dynamic variable.

```delete <ptr>;```  used for dynamic variables

```delete [] <ptr>;```  used for dynamic arrays

<!-- #include [[examples/ptr-new-delete]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int x, y;
  int *p = new int;
  cin >> x;
  int *q = new int[x];
  Fish *f = new Fish;

  delete p;     // p = nullptr;
  delete [] q;  // q = nullptr;
  delete f;     // f = nullptr;

  return 0;
}
<!-- /include -->

## Problems with Pointers

**Dangling Pointers** are pointers that are used with invalid addresses
<!-- #include [[examples/ptr-dangling]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int *p;
  // *p = 5;  Where is *p?

  p = new int[3];

  // p[10] = 7;      Invalid Write
  // int x = p[10];  Invalid Read
  delete [] p;
  // p[3] = 8;  Dangling Pointer!

  return 0;
}
<!-- /include -->

**Memory Leaks** occur when dynamic memory becomes unreachable
<!-- #include [[examples/ptr-mem-leak]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int *p;

  for( int r=0; r < 10; r++ )
    p = new int[10];  // AAAA! Memory Leak!

  return 0;
}
<!-- /include -->

These problems create very nasty bugs, because they often do not crash your program. They allow it to go on until something else breaks as a result!

Some good rules-of-thumb to avoid pointer problems:
* every call to ```new``` should have a corresponding call to ```delete```
* pointers should be initialized to a value or ```nullptr```
* after de-allocating a pointer, it should be set to ```nullptr```

Other issues to watch out for include **double-free** errors (deleting a pointer twice) and **shallow copies** (copying a memory address when you intended to copy the object pointed to).

## 2D-Dynamic Array

<!-- #include [[examples/ptr-2d-array]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int **q;  // Dynamically allocating 3x4 grid
  q = new int*[3];
  for (int k = 0; k < 3; k++)
    q[k] = new int[4];

  q[1][1] = 0;
  q[2][3] = 4;

  //delete [] q;  BAD! Memory has been leaked
  for (int k = 0; k < 3; k++)
    delete [] q[k];
  delete [] q;  q = nullptr;  // Safely De-allocating

  return 0;
}
<!-- /include -->

---

## The _this_ pointer

Every member function in C++ has a _hidden_ extra parameter added to it implicitly. It contains the memory address of the _calling object_, and can be accessed by its name, ```this```. It can be used whenever you need a function to refer to the object that called it.
<>

# Default Member Functions

Whenever a user-defined class is created, C++ automatically generates three special functions: a Destructor, an Operator= (assignment operator), and a copy-constructor.

<!-- #include [[examples/ptr-def-mem-func]] -->
```c++

// For a class “Foo” with members “x” “y” “z”

~Foo()
{
  // 🦗 ... nothing, the default destructor does nothing
}

const Foo& operator=( const Foo &rhs )
{

  if (this != &rhs) // alias check
  {
    x = rhs.x;  // direct copy of each member var
    y = rhs.y;
    z = rhs.z;
  }

  return (*this);  // return the calling object
}

Foo( const Foo &rhs )
{

  *this = rhs;  // invoke the operator=
}
```
<!-- /include -->


## Destructor

The destructor is the “clean-up” function that is called whenever an object reaches the end of it’s scope. It’s job is to safely de-allocate any dynamic member variables that may be tied to that object.

<!-- #include [[examples/ptr-destructor]] -->
```c++
class IntBox  // example class with dynamic member variable
{
  int *item;
  public:
    IntBox(int i)
    {
      item = new int(i);
    }
};

~IntBox()  // "proper" destructor
{
  delete item;
}
```
<!-- /include -->


## Operator=

The assignment operator is used to make one (existing) object into a copy of another.

<!-- #include [[examples/ptr-assign-op]] -->
```c++
class IntBox  // example class with dynamic member variable
{
  int *item;
  public:
    IntBox(int i)
    {
      item = new int(i);
    }
};

// "proper" assignment operator
const IntBox& operator=( const IntBox &rhs )
{
  if (this != &rhs)
  {
    *item = *rhs.item;  // "deep copy" of pointer members
    return (*this);  // return the calling object
  }
}
```
<!-- /include -->


## Copy Constructor

The copy constructor serves a very similar purpose to the operator=, it ==creates a new object== that is a copy of another. There are a few different scenarios in which the copy constructor is invoked.

* Declaration with initialization   ```int myInt = myOtherInt;```
* Pass-by-value functions   ```int& Foo( int byValue )```
* Return-by-value functions   ```int Bar( int &byReference )```

<!-- #include [[examples/ptr-copy-constructor]] -->
```c++
class IntBox  // example class with dynamic member variable
{
  int *item;
  public:
    IntBox(int i)
    {
      item = new int(i);
    }
};

// “proper" copy constructor
IntBox( const IntBox &rhs )
{
  item = new int;  // initialize pointer
  *this = rhs;  // invoke operator=
}
```
<!-- /include -->

As a general rule, if your class contains a pointer to a dynamically allocated object, you must override **all three** of the default member functions.