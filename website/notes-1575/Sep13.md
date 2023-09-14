

Date: 2023-09-13


Reminders:
* [ ]  [[PA01]] released

Objectives:
* [ ] Finish [[Polymorphism]]

---




### _virtual_ Destructors

When working with polymorphic classes, it is important to always make destructors virtual.

[[examples/poly-virt-destructor]]
```c++
class FarmAnimal
{
  public:
    virtual ~FarmAnimal() {}
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
class 🦊 : public FarmAnimal {}

int main()
{
  🦊 my_fox; // ERROR! cannot create object of abstract type 🦊
}
```
[[examples/poly-abstract-class]]

A class that contains _only_ pure virtual functions are known as **interfaces**. These interfaces are a powerful tool for enforcing an organizational structure for large software projects 

(ex. The C++ Standard Library uses polymorphism extensively!)

# Exception Handling in C++

As computer scientists, we study and admire elegant and iron-clad algorithms that can be trusted to predictably arrive at the desired result. In reality, code is never so air-tight. There will always be **exceptions**, some foreseeable (_edge cases_) and others... unexpected 🐞.

The best that we can do is anticipate when and where something might go wrong, and fortify our program with exception-handling code.

## Keywords

There are 3 C++ keywords that are used in exception handling.

* **try** - defines a code block that _could_ fail
* **throw** <variable> - used to signal a failure
* **catch** (type var) - defines a code block to handle an error

A try-block is always followed immediately by one or more catch-blocks. When a throw statement is reached inside a try-block, the program jumps directly to a matching catch-block where the exception can be handled safely.

[[examples/except-basics]]
<!-- #include [[examples/except-basics]] -->
```c++
#include <vector>
#include <utility>
using namespace std;

typedef Vector<pair<float,float>> ranges;
// Got a tongue-twister of a type? Use a typedef!

ranges partition(float begin, float end, int p)
{
  //Returns a vector of p equal partitions in range [begin, end]
  ranges partitions;
  float partition_size = (end - begin) / p;

  pair<float, float> range;
  range.first = begin;
  range.second = begin + partition_size;
  for (int i=0; i < p; i++)
  {
    partitions.push_back(pair<float,float>(range));
    range.first = range.second;
    range.second += partition_size;
  }

  return partitions;
}
```

**Now let's add some exception handling!**
```c++
ranges partition(float begin, float end, int p)
{
  //Returns a vector of p equal partitions in range [begin, end]
  ranges partitions;
  try {  // exception may occur in this block!
    if (p <= 0) throw p;  // throwing exception, jump to catch block!

    float partition_size = (end - begin) / p;

  
    pair<float, float> range;
    range.first = begin;
    range.second = begin + partition_size;
    for (int i=0; i < p; i++)
    {
      partitions.push_back(pair<float,float>(range));
      range.first = range.second;
      range.second += partition_size;
    }
  }  // end try-block
  catch(int bad_p)  //code execution resumes here if exception thrown
  { 
    cout << "invalid number of partitions: " << bad_p <<
         << "returning empty vector!" << endl; 
  }
  return partitions;
}
```
<!-- /include -->


It is also possible to have multiple catch statements for handling different exceptions in different ways.

[[examples/except-mult-catch]]
<!-- #include [[examples/except-mult-catch]] -->
```c++
ranges partition(float begin, float end, int p)
{
  //Returns a vector of p equal partitions in range [begin, end]
  ranges partitions;
  try {  // exception may occur in this block!
    if (end <= begin) throw "end must be greater than begin!";
    if (p <= 0) throw p;  // throwing exception, jump to catch block!
    

    float partition_size = (end - begin) / p;
    
    pair<float, float> range;
    range.first = begin;
    range.second = begin + partition_size;
    for (int i=0; i < p; i++)
    {
      partitions.push_back(pair<float,float>(range));
      range.first = range.second;
      range.second += partition_size;
    }
  }
  catch(int bad_p)  //code execution resumes here if exception
  { 
    cout << "invalid number of partitions: " << bad_p <<
         << "returning empty vector!" << endl; 
  }
  catch(const char *e) //"string" literals are char arrays
    cout << e << endl;
  
  return partitions;
}
```
<!-- /include -->

Normally, the type of the object thrown and the type of the catch block must match exactly. With one exception:

```c++
  try 
  {
    throw 🐩 poodle_error;
  }
  catch (🐶 dog_error)
  {
    cout << "base class catch blocks catch derived classes too!";
  }
```
