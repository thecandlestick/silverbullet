

Date: 2023-09-06


Reminders:
* [ ]  Work on [[PA00]] due Friday

Objectives:
* [ ] Finish Pointers
* [ ] OOP

---


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

# Inheritance in C++

Definition:
  The ability to declare a class as an _extension_ of another class

Through this process, a **derived class** inherits all member variables and all member functions of a **base class** (except for constructors/destructors). The derived class may then extend the functionality through additional members.

[[examples/oop-inheritance]]
```c++
class 🐶
{
  bool unwavering_loyalty;
  public:
    char *name;
    void bark();
};

class 🐩 : public 🐶
{
  public:
    bool fluffy_coat;
    void snore();
};
```

_**evilllll**_
```c++
class 🌭 : public 🐶, public 🌞
{
  // multiple inheritance is possible... but ill-advised ⚠️
};
```

Most company coding standards and style guides will advise against _multiple inheritance(above)_ in favor of _composition(below)_.

```c++
class 🌭
{
  🐶 member1;
  🌞 member2;
};
```

---
[[examples/oop-type-compatibility]]
```c++
class 🐶
{
  private:
    bool happy_dog;
};

class 🐩 : public 🐶
{
  private:
    bool pedigree;
}

void walk(🐶 &d) { '🦮' ; d.happy_dog = true; }
bool is_purebred(🐩 p) { return p.pedigree; }

int main()
{
  🐶 fido;
  🐩 lucky;

  walk(fido);
  walk(lucky);  // Valid! walk() expects a 🐶 but accepts a 🐩

  🐶 *dog_ptr = &lucky; // Valid! Pointers can point to derived types

  🐶 rex(lucky);  // Valid! Even the copy constructor and operator=
  fido = lucky;

  is_purebred(fido); // Error! Function only accepts 🐩
  lucky = rex; // Error!

  try 
  {
    throw 🐩 poodle_error;
  }
  catch (🐶 dog_error)
  {
    cout << "base class catch blocks catch derived types too!";
  }
}
```
