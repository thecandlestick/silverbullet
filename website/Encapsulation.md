---
tags: template
trigger: encapsulation
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
