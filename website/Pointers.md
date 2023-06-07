
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

  cout << q << *q;  // 0 <memory-address>
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
  int *q;   // Pointers can be members of a class ...
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
  Fish* p = &Nemo;  // ... and pointers can point to class objects
  
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

Pointers are used to track and manage these _dynamic_ variables.

## _new_ Operator

(Dynamically) Allocates a new variable or array of variables and returns a pointer to it

## _delete_ Operator

De-allocates a dynamic variable

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

# Default Member Functions


## Destructor

[[examples/ptr-destructor]]

## Operator=

[[examples/ptr-assign-op]]

## Copy Constructor

[[examples/ptr-copy-constructor]]