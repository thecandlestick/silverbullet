---
tags: template
hooks.snippet.slashCommand: polymorphism
---

# Polymorphism in C++

Poly - many 
Morph - shape

**Definition-0:** The ability of an object to take _many shapes_

## Static vs. Dynamic Type

[[examples/poly-static-dyn-type]]
```c++
class 🐶 {};
class 🐩 : public 🐶 {};

int main()
{

  🐶 *dog_ptr = new 🐩;  // What is the type of (*dog_ptr)?

}
```

Objects in C++ actually possess two different types, a **static type** and a **dynamic type**.
  * The _static type_ of an object is a _by-the-text_ interpretation, what the object appears to be when inspecting the code (the type of the variable referencing that object).
  * The _dynamic type_ of an object is a _by-the-execution_ interpretation, what the object actually is in the context of the program. For objects accessed through pointers specifically, this dynamic type can often differ from the static type.

## Dynamic Cast

When accessed through a pointer, objects will be treated as the type specified by the pointer regardless of their dynamic type. This includes not being able to access members exclusive to the dynamic type. One way around this is to perform a **dynamic cast** on the pointer.

```c++
class 🐶 {};
class 🐩 : public 🐶 
{
  public:
    void sit();
};

int main()
{
  🐶 *dog_ptr = new 🐩;
  dog_ptr -> sit(); // Error! *dog_ptr does not have member sit()
  dynamic_cast<🐩*>(dog_ptr) -> sit(); // Success!

  🐩 *poodle_ptr = dog_ptr; // Error! incompatible types
  🐩 *poodle_ptr = dynamic_cast<🐩*>(dog_ptr); // Success!
}
```

When invoked, dynamic_cast will check the dynamic type of the object being pointed to. If the dynamic type matches, it will return a pointer of the requested type which can be used to access derived-type members. If the dynamic type does not match what is requested, dynamic_cast will return _nullptr_.

**Definition-1:** The ability for an object of a certain _static type_ to behave differently according to its _dynamic type_

A common use-case for polymorphism is for representing _heterogeneous collections_. That is, when you have a collection of very closely related classes each with distinct behavior.

[[examples/poly-heterogeneous-collection]]
```c++
class FarmAnimal
{
  void speak() { cout << "... "; }
};

class 🐄 : public FarmAnimal
{
  void speak() { cout << "Mooo "; }
};

class 🐖 : public FarmAnimal
{
  void speak() { cout << "Oink "; }
};

class 🐎 : public FarmAnimal
{
  void speak() { cout << "Neigh "; }
};

int main()
{
  FarmAnimal *farm[3];
  farm[0] = new 🐄;
  farm[1] = new 🐖;
  farm[2] = new 🐎;

  for (int k=0; k < 4; k++)
  {
    farm[k] -> speak();  // output: "... ... ... "
  }
}
```

_#KnowledgeCheck: In the code above, what is the static type and the dynamic type of the object farm[2]?_

By default, C++ will always consider the _static type_ of an object when determining which version of a member function to call. If you want to change this, you must use the _virtual_ function qualifier.

## The _virtual_ Qualifier

If a function is qualified with the keyword **virtual**, then C++ will first determine the _dynamic type_ of the calling object before making the appropriate function call. This qualifier must be applied to the base class.

```c++
class FarmAnimal
{
  virtual void speak() { cout << "..."; }
}
```

By making this change, the output of the program above becomes 
  ```"Mooo Oink Neigh "```

The _virtual_ qualifier is passed down from base class to derived class. This is non-optional even for redefined member functions regardless of whether or not _virtual_ is used in the derived version. Despite this, it is still considered good practice to explicitly add the _virtual_ qualifier for clarity sake.

```c++
class 🐮💢 : public 🐄
{
  virtual void speak() { cout << "Grrr! "; }
}

int main()
{
  FarmAnimal *my_cow = new 🐮💢;
  my_cow -> speak();  // output: 
}
```

Curious students can look into the topic of _V-Tables_ for an explanation of how C++ keeps track of which function to call for a given type.

### _virtual_ Destructors

When working with polymorphic classes, it is important to always make destructors virtual.

[[examples/poly-virt-destructor]]
```c++
class FarmAnimal
{
  public:
    ~FarmAnimal() {}
}

class 🐔 : pubic FarmAnimal
{
  🥚 *nest = new 🥚[3];
  public:
    ~🐔() { delete [] nest; }
}

int main()
{
  FarmAnimal *my_chicken = new 🐔;
  delete my_chicken; // MEMORY LEAK unless ~FarmAnimal() made virtual
}
```

## Abstract Classes

Notice that in the examples given, the FarmAnimal class is never meant to be used directly. FarmAnimal::speak() is simply used as a placeholder for each of the derived classes to redefine.

This is a common pattern in OOP design, and the best practice is to make this intention explicit and non-optional through the use of _pure virtual functions_.

A **pure virtual function** is a function with no accompanying code body, it is only a description of a function and cannot be executed.

```c++
class FarmAnimal
{
  virtual void speak() = 0;  // speak is a pure virtual function 
}
```

An **abstract class** is a class that has at least one _pure virtual function_. A consequence of a class being abstract is that abstract classes _cannot be instantiated_. 

When inheriting from an abstract class, the derived type will be abstract unless _ALL_ pure virtual functions are redefined.

```c++
class 🦊 : FarmAnimal {}

int main()
{
  🦊 my_fox; // ERROR! cannot create object of abstract type 🦊
}
```
[[examples/poly-abstract-class]]

A class that contains _only_ pure virtual functions are known as **interfaces**. These interfaces are a powerful tool for enforcing an organizational structure for large software projects 

(ex. The C++ Standard Library uses polymorphism extensively!)
