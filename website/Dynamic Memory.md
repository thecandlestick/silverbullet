---
tags: template
hooks.snippet.slashCommand: dynamic-memory
---

# Dynamic Memory

Standard variables are created at _compile time_, but it is also possible to create variables on-demand during _run time_.

Variables created during run time have no name by which to refer to them. Instead, pointers are used to track and manage these _dynamic_ variables.

Standard variables exist in a part of memory known as the **stack**. Dynamic variables exist in a different part of memory known as the **heap.**

[[snippet/ops/cpp-new-delete]]
## _new_ Operator

(Dynamically) Allocates a new variable or array of variables to the heap and returns a pointer to it

```my_pointer = new <type>``` used for dynamic variables

```my_pointer = new <type>[<size>]``` for dynamic arrays

## _delete_ Operator

Unlike local variables that get removed when leaving their scope, dynamic variables can persist indefinitely. It is therefore the _programmer’s_ responsibility to clean up after themselves. the _delete_ operator must be used to de-allocate a dynamic variable.

```delete <ptr>;```  used for dynamic variables

```delete [] <ptr>;```  used for dynamic arrays


[[examples/ptr-new-delete]]
```c++
#include <iostream>
using namespace std;

int main()
{
  int x, y;
  int *p = new int;
  cin >> x;
  int *q = new int[x];
  Fish *f = new Fish; // user-defined class, Fish

  delete p;     // p = nullptr;
  delete [] q;  // q = nullptr;
  delete f;     // f = nullptr;

  return 0;
}
```

## Problems with Pointers

**Dangling Pointers** are pointers that are used with invalid addresses. This can happen if the pointer is uninitialized, used after being de-allocated, or if the address being stored is unintentionally changed.

Calling _delete_ **DOES NOT** alter the pointer in any way. It **ONLY** de-allocates the memory used by the object being _pointed to_.

**Invalid Reads/Writes** occur when pointers are used to read or write to memory that doesn’t belong to your program. It is important to note that even if the pointer stores a valid memory address, it can still perform an invalid read/write!

[[examples/ptr-dangling]]
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
```

**Memory Leaks** occur when dynamic memory becomes unreachable. Any dynamically-allocated variable on the heap must at all times remain _anchored_ to the stack in some way, either directly via a pointer or indirectly through some chain of pointers.

Once that connection is lost, it becomes (nearly) impossible to access or de-allocate that memory until the program ends.

[[examples/ptr-mem-leak]]
```c++
#include <iostream>
using namespace std;

int main()
{
  int *p;

  for( int r=0; r < 10; r++ )
    p = new int[10];

  return 0;
}
````


These problems create very nasty bugs, because they often do not crash your program. They allow it to go on until something else breaks as a result!

Some good rules-of-thumb to avoid pointer problems:
* every call to ```new``` should have a corresponding call to ```delete```
* pointers should be initialized to a value or ```nullptr```
* after de-allocating a pointer, it should be set to ```nullptr```

Other issues to watch out for include **double-free** errors (de-allocating the same piece of dynamic memory twice) and **shallow copies** (copying a memory address when you intended to copy the object at that memory address).

_#KnowledgeCheck The code below has a bug, which of the following best describes the issue?_

```c++
1. int arr_size = 24;
2.  int *ptr_1 = new int[arr_size];
3. 
4.  for (int k = 0; k < arr_size; k++)
5.    ptr_1[k] = k*k;
6. 
7.  int *ptr_2 = new int[arr_size];
8.  ptr_1 = ptr_2;
9.  delete [] ptr_1;
10. 
11. ptr_1 = nullptr;
12. ptr_2 = nullptr;
```

* A) Dangling Pointer
* B) Invalid Assignment
* C) Memory Leak
* D) No Issue
_hint: trace a memory diagram if you’re unsure_

## 2D-Dynamic Array

Pointers can also be used to dynamically allocate multidimensional arrays. To create a NxM array of ints, a pointer-to-int-pointers allocates N int pointers, each of which allocates M ints.

De-allocating a multidimensional array must be done in the opposite order. The deepest pointers have to be de-allocated first, or else memory will be leaked.

[[examples/ptr-2d-array]]
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
```

---

## The _this_ pointer

Every member function in C++ has a _hidden_ extra parameter added to it implicitly. It contains the memory address of the **calling object**, and can be accessed by its name, **this**. It can be used whenever you need a function to refer to the object that called it.

```T* const this``` is the type and name of this special pointer

For reference, in the line: ```myClassObj.myClassFunc()```

_myClassObj_ is known as the _calling object_. It’s memory address will be stored in the special pointer _this_ and passed into _myClassFunc()_

# Default Member Functions

Whenever a user-defined class is created, C++ automatically generates three special functions: a Destructor, an Operator= (assignment operator), and a copy-constructor.

[[examples/ptr-def-mem-func]]
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

Foo( const Foo &rhs ) : x (rhs.x), y (rhs.y), z (rhs.z)
{
  // Same behavior as the operator= above  
}
```



## Destructor

The destructor is the “clean-up” function that is called whenever an object reaches the end of it’s scope. It’s job is to safely de-allocate any dynamic member variables that may be tied to that object.

[[examples/ptr-destructor]]
```c++
class IntBox  // example class with dynamic member variable
{
  int *item;
  public:
    IntBox(int i){ item = new int(i); }
    ~IntBox();
};

int main()
{
  for (int i = 0; i < 3; i++)
  {
    IntBox myintbox(i);
  }  // Destructor called here

  return 0;
}

IntBox::~IntBox()  // "proper" destructor
{
  delete item;
}
```


## Operator=

The assignment operator is used to make one (existing) object into a copy of another.

[[examples/ptr-assign-op]]
```c++
#include <iostream>
using namespace std;

class IntBox  // example class with dynamic member variable
{
  int *item;
  public:
    IntBox(int i){ item = new int(i); }  // constructor
    void set(int x) { *item = x; }       // mutator
    void print() { cout << *item; }      
    const IntBox& operator=( const IntBox &rhs );
};

int main()
{
  IntBox b1(4);
  IntBox b2(200);

  b1 = b2; // operator= called here
  
  b1.set(5);
  b1.print();
  b2.print();

  return 0;
}

// "proper" assignment operator
const IntBox& IntBox::operator=( const IntBox &rhs )
{
  if (this != &rhs)
  {
    *item = *rhs.item;  // "deep copy" of pointer members
    return (*this);  // return the calling object
  }
}
```



## Copy Constructor

The copy constructor serves a very similar purpose to the operator=, it ==creates a new object== that is a copy of another. There are a few different scenarios in which the copy constructor is invoked.

* Declaration with initialization   ```int myInt = myOtherInt;```
* Pass-by-value functions   ```int& Foo( int byValue )```
* Return-by-value functions   ```int Bar( int &byReference )```

[[examples/ptr-copy-constructor]]
```c++
class IntBox  // example class with dynamic member variable
{
  int *item;
  public:
    IntBox(int i) { item = new int(i); }
    IntBox( const IntBox &rhs );
};

int main()
{

  IntBox b1(3); //created with parameterized constructor
  IntBox b2(b1); //created with copy constructor
  IntBox b3 = b1; //also created with copy constructor
  
  return 0;
}

// “proper" copy constructor
IntBox::IntBox( const IntBox &rhs )
{
  item = new int;  // initialize pointer

  *this = rhs; // common trick: invoke operator=
  // *item = *rhs.item (would also work)
}
```

As a general rule, if your class contains a pointer to a dynamically allocated object, you must overwrite **all three** of the default member functions. For classes without pointers, this is generally not necessary.