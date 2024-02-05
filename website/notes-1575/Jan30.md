#cs1575LN
|  |  |  |  |
|----------|----------|----------|----------|
| [[CS1575|Home]] | [[CS1575 Calendar|Calendar]] | [[CS1575 Syllabus|Syllabus]] | [[Lecture Notes]] |


## Reminders

```query
cs1575task
where done = false
render [[template/task]]
```

## Objectives

```query
task
where page = "CS1575 Calendar" and done = false
limit 3
order by pos
render [[template/topic]]
```
---

## 2D-Dynamic Array

Pointers can also be used to dynamically allocate multidimensional arrays. To create a NxM array of ints, a pointer-to-int-pointers allocates N int pointers, each of which allocates M ints.

De-allocating a multidimensional array must be done in the opposite order. The deepest pointers have to be de-allocated first, or else memory will be leaked.

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

Every member function in C++ has a _hidden_ extra parameter added to it implicitly. It contains the memory address of the **calling object**, and can be accessed by its name, **this**. It can be used whenever you need a function to refer to the object that called it.

```T* const this``` is the type and name of this special pointer

For reference, in the line: ```myClassObj.myClassFunc()```

_myClassObj_ is known as the _calling object_. It’s memory address will be stored in the special pointer _this_ and passed into _myClassFunc()_

# Default Member Functions

Whenever a user-defined class is created, C++ automatically generates three special functions: a Destructor, an Operator= (assignment operator), and a copy-constructor.

<!-- #include [[examples/ptr-def-mem-func]] -->
```c++

// For a class “Foo” with members “x” “y” “z”

~Foo()
{
  // 🦗 ... nothing, the default destructor does nothing
}

A = B;
// calling object = rhs

A = A;

A = B = C;

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
  // Same as above  
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
<!-- /include -->



## Operator=

The assignment operator is used to make one (existing) object into a copy of another.

<!-- #include [[examples/ptr-assign-op]] -->
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
<!-- /include -->

As a general rule, if your class contains a pointer to a dynamically allocated object, you must overwrite **all three** of the default member functions. For classes without pointers, this is generally not necessary.


# Object Oriented Programming

OOP is a _programming paradigm_ centered around the idea of organizing your code through _objects_. Objects are a coupling of data and the code that is meant to act on that data. (variables + functions)

## The 3 Pillars of OOP

There are three (generally) agreed upon aspects OOP design

* [[Encapsulation]]
* [[Inheritance]]
* [[Polymorphism]]


Different programming languages will express these ideas in different ways. Some languages may support only some aspects of OOP design, and others may be incompatible with OOP entirely.  