

Date: 2023-09-15


Reminders:
* [ ]  [[PA01]] due Monday

Objectives:
* [ ] Finish Exception Handling

---


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

[[examples/except-multiple-catch]]
<!-- #include [[examples/except-multiple-catch]] -->
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

_KC: What will be the output of the code below?_

```c++

try {

  throw "an error has occurred";

  cout << "A ";
}


catch( int err )
{
  cout << "B ";
}

catch( const char *err)
{
  cout << "C ";

}

catch( ... ) { error-handling code here 

```

---
## Catch-all

A useful exercise in C++ exception handling is to create a _catch-all_ block that accepts any incoming exception type.

```catch( ... ) { error-handling code here }```

This is commonly used in instances where you want all types of exceptions to be handled in the same way or to define a _default_ error-handling block that will catch any errors unforeseen by the programmer.

**Note:** C++ will stop at the first matching _catch_ block, so if you have multiple you should always place catch( ... ) last.


---
## Stack-unwinding

try-catch pairs must be placed in the same scope as each other, but that does not apply to _throw_ statements. It’s possible to, for example, write a function that only throws exceptions and does not specify how they should be caught/handled.

In this case, a throw statement will cause the exception handler to start searching through higher scopes for a corresponding catch block.

[[examples/except-scope]]

<!-- #include [[examples/except-scope]] -->
```c++
#include <vector>
#include <utility>
using namespace std;

typedef Vector<pair<float,float>> ranges;

ranges partition(float begin, float end, int p)
{
  //Returns a vector of p equal partitions in range [begin, end]
  if (end <= begin) throw "end must be greater than begin!";
  if (p <= 0) throw p;  // throwing exception, jump to catch block!
    
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

int main()
{

  try{ // calling a function with possible exceptions
    ranges myRanges = partition(2.0, 5.0, 4);
  }
  catch( ... )  // and deciding how to handle them!
  {  
    cout << "something went wrong!" << endl;
  }

  return 0;
}
```
<!-- /include -->

This is actually the more common approach to exception handling, and useful for code items intended to be used in a variety of different contexts.

---
## Standard Library Exceptions

The C++ standard library provides a number of preset exception types that are used in various places throughout other parts of library code. You can read about each one in more detail [here](https://en.cppreference.com/w/cpp/error/exception)

```#include <exception>```

![cpp standard library exceptions](img%2Fstdexcept.png)

You can structure your code to accept these _exception_ objects, or create custom error objects of your own.

