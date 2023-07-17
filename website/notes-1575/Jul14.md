

Date: 2023-07-14
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=07ac7965-064d-4ea0-8871-b03f01396db4

Reminders:
* [x] quiz 5
* [x] pa04 due tonight

Objectives:
* [x] inheritance in c++

---


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
class 🌭 : public 🐶, public 🌡
{
  // multiple inheritance is possible... but ill-advised ⚠️
};
```

Most company coding standards and style guides will advise against _multiple inheritance(above)_ in favor of _composition(below)_.

```c++
class 🌭
{
  🐶 member1;
  🌡member2;
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
}
```

* [x] garret w
* [x] tony

As a general rule, objects of a _derived type_ can be used anywhere that an object of the _base type_ is specified. The inverse, however, is not true. Objects of the _base type_ cannot be substituted for objects of the _derived type_.

An (somewhat) exception to this rule is that base and derived types are distinguished for the purpose of [[Encapsulation]] levels. 

---
Encapsulation refers to the ability for an object to hide or restrict access to its data. Its purpose is to help ensure that the data belonging to an object remains in a _valid state_ for functions operating on that object and to enforce a layer of abstraction between the class structure and the end-programmer.

# Encapsulation in C++

C++ has three levels of encapsulation that can be applied to both _member variables_ and _member functions_:

* **Public**: members at this level can be accessed anywhere
* **Private**: members at this level can be accessed by objects of the _exact_ same type as the owner object 
* **Protected:** members at this level can be accessed by objects of the same type _or a derived type_ of the owner


## Derived Classes Inherit Encapsulation Levels

This is particularly important to note when inheriting private members from the base class.

```c++
class 🐶
{
  private:
    bool tagged;
};

class 🐩 : public 🐶 
{
  public:
    bool is_stray() { return !tagged; }
    // ERROR! cannot access private member `tagged`
};
```

A simple fix for this problem is to use the _protected_ level for classes that are intended to be extended via inheritance.

```c++
class 🐶
{
  protected:
    bool tagged;
};

class 🐩 : public 🐶 
{
  public:
    bool is_stray() { return !tagged; }
};

void adopt( 🐶& good_dog );

int main()
{
  🐩 fifi;

  if (fifi.is_stray()) 
    adopt(fifi);
}
```


## Levels of Inheritance

Though it is a rarely used feature, you can select between _public, protected, and private_ inheritance in C++. Public inheritance is preferable for 99.99% of use cases, the others are very rarely seen 🦄

```c++
class 🐩 : public 🐶 {};

class 🐕‍🦺 : protected 🐶 {};

class 🌭 : private 🐶 {};
```

* **public**: all inherited members retain their encapsulation levels
* **protected**: _public_ members are elevated to _protected_ encapsulation
* **private**: all inherited members are elevated to _private_ encapsulation


---

When inheriting members of the base class, derived classes can redefine that member for their own purposes. The base version is still retained, however, in a separate _namespace_

[[examples/oop-redefine-members]]
```c++
class 🐶
{
  bool likes_pats;
  public:
    double bark_volume;
    void bark();
};

class 🐩 : public 🐶
{
  public:
    double bark_volume;
    void bark();
};

int main() {

  🐩 spot;  // 🐩 obj. has two bark_volume and two bark()

  spot.🐶::bark_volume = 5.0;  // Specify which using namespace
  spot.🐶::bark();

  spot.🐩::bark_volume = 1.5;  // Defaults to 🐩::
  spot.bark();

}
```

---

Constructors are not technically inherited from base to derived class, but a constructor for the derived class will implicitly make a call to the constructor for the base class _before_ executing its own. 

Which constructor gets called can be specified but defaults to the default constructor.

[[examples/oop-constructors]]
```c++
class Apple
{
  public:
    int 🌳, 🍎;
    Apple() : 🌳(0), 🍎(0) {}
    Apple(int a, int b) : 🌳(a), 🍎(b) {}
};

class GreenApple : public Apple
{
  public:
    int 🍏;
    GreenApple(int i) : 🍏(i) {}
    GreenApple() : Apple(1,1), 🍏(1) {}
};

class GrannySmithApple : public GreenApple
{
  public:
    int 👵🏻;
    GrannySmithApple() : 👵🏻(0) {}
    GrannySmithApple(int c) : GreenApple(c), 👵🏻(c) {}
};

int main()
{
  GreenApple a(3);  // 🌳 = 0  🍎 = 0  🍏 = 3
  GreenApple b();  // 🌳 = 1  🍎 = 1  🍏 = 1

  GrannySmithApple c();  // 🌳 = 1  🍎 = 1  🍏 = 1  👵🏻 = 0
  GrannySmithApple d(7);  // 🌳 = 0  🍎 = 0  🍏 = 7  👵🏻 = 7

}
```

* [x] sarah
* [x] dheeraj

---

Destructors follow a similar rule. The destructor of a derived class will implicitly make a call to the destructor of the base class _after_ executing its own.

[[examples/oop-destructors]]
```c++
class Apple
{
  public:
    int *orchard = new int;
    ~Apple() { delete orchard; }
};

class GreenApple : public Apple
{
  public:
    char *variety = new char[24];
    ~GreenApple() { delete [] variety; } 
};

class GrannySmithApple : public GreenApple
{
  public:
    int *exp_date = new int;
    float *price = new float;
    ~GrannySmithApple() { delete exp_date; delete price; }
};
```
---

Templates can be used to create derived classes, a template can be created as an extension of a base class, and a template can extend another template. 

What is important to keep in mind is that a template is _not a class_. In order to use a template for inheritance you _must_ supply a template parameter, even if that parameter is itself a templated type.

[[examples/oop-templates]]
```c++
template <typename T>
class 🐈
{
  T cat_template;
};

// 🐈 mycat; // ERROR!
🐈<int> mycat; // Valid

class 🐈‍⬛ : public 🐈<double> {}; //VALID
// class 🐈‍⬛ : public 🐈 {}; //ERROR!

template <typename T>
class 🐯 : public 🐈<T>
{
  T tiger_template;
}

template <typename T, typename U>
class 🦁 : public 🐈<T>
{
  U lion_template;
}
```

