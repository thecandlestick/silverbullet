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

* [ ] PA01  📅2024-02-15 #cs1575task

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

_#KnowledgeCheck What will be the output of the code below?_

```c++
try {
  throw "an error has occurred";
  cout << "A ";
}

catch( int err )
{
  cout << "B ";
}

catch( const char *err )
{
  cout << "C ";
}
...
```

A) A
B) B
C) C
D) A B C
E) A C
F) C A

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



#DiscussionQuestion ==What is it that computer scientists do?==

## Problems and Algorithms and Programs! Oh My!

In order to apply computers to real-world problems, those problems must be _formally represented_. That is, we need strict and precise description of input and output, then the problem to be solved is mapping one to the other. The unambiguous, finite steps we take to do so are what we call an _algorithm_, but the selection of input and output always comes first.

This leads us to a core component of computer science, how we choose to represent a problem can lead to more efficient programs, more accurate (to the real-world) programs, or simply programs that are more maintainable / easy to understand. Trade-offs are everywhere and unavoidable!

What does solving a problem entail?
* Computations (logic)
* Storing & Manipulating **Data** <- (the big one)


# Abstract Data Types

Just as computer scientists decide upon problem representations, we are also tasked with devising ways to take the relevant problem-data and represent it in the computer. 

An **Abstract Data Type** (ADT) is a way of describing the _shape_ and _utility_ of a data representation without specifying _how it works_.

Breaking that down a bit, by _shape_ we essentially mean what the data is (an integer, a continuous value, etc.), or in the case of _collections_ of data, how the individual pieces of data are related to each other. Do they have an order to them? Is that order linear or hierarchical? Does the relationship between them come from the values they store or from the problem we are trying to represent? Luckily for us, these underlying patterns of relationships have been studied by mathematicians long before computers existed. That is why one component of an ADT is a **mathematical object** that best fits the answer to these questions. Examples might include _sequences, sets, trees, graphs, or functions_

By _utility_, we mean what we want to be able to do with that data. Will we need to add more data as the program goes along? What about removing data? Do we need the ability to retrieve data or change the order of it? All of this goes into the **operations** that we define for our ADT.

Put another way, ==an ADT is a **mathematical object** together with its **operations.** ==Note that these concepts have nothing to do with code, the underlying details of how we store the data and make the operations function is completely programming-language-dependent and is typically tailored to the problem at hand.

## ADT Covered in This Course:

  * [[Lists]]
  * [[Stacks & Queues]]
  * [[Maps]]
  * [[Priority Queues]]
  * [[Graphs]]

# Data Structures

==A **Data Structure** is a _particular implementation_ of an abstract data type. ==There can be, and indeed often are, many different implementations to choose from. This stems from the unfortunate but unavoidable fact that any implementation of an ADT is _always_ going to be less powerful than the mathematical object that it emulates.  (9^2939823503094 is a valid integer, but can you store it in a computer?)

We have to make concessions and consider the trade-offs between different data structures in order to build efficient and scalable programs. Which operations should we optimize? Do we care more about speed or memory-usage? Navigating these questions and choosing the right data structure for the job can mean the difference between a program finishing in seconds, hours, or never at all! 

## The Problem-solving Playbook

Does this all sound kinda complicated? It can be, but don’t worry! Building efficient programs takes practice, but it can be done if you follow these tried-and-true steps to programming success:

**Fore! 🏌️ For-malize the problem, that is!** We need a formal, mathematical representation of the problem at hand. This often means stripping away all unnecessary details until we’re left with only the most essential characteristics.

**Hut-hu- 🏈 High-level algorithms come next!** Don’t get too caught up in specifics just yet, a high-level algorithm describes the steps to take in plain English. It’s here that you can start to think about what kind of operations will be needed, which leads naturally into selecting an appropriate ADT.

**Come on, Ref! 🏁 Ref-ine that algorithm!** Now that you have an idea of what type of ADT you’ll be using, it’s time to think about the best way of implementing it into a data structure. Which operations are most important, and what can you sacrifice in the name of overall efficiency?

**Stick 🏒 to the plan!** Everything’s in place for the perfect play, all that’s left is to implement! That said, no program is perfect. You can continue to iterate on these steps, further refining your algorithm, exploring a totally different high-level solution, or even changing how you represent the problem in the first place!