---
tags: template
hooks.snippet.slashCommand: list
---

# The List Abstract Data Type

A List is a _sequence_ of elements of the same type
```latex
< a_0, a_1, a_2, ... , a_n >  
```

where:
```latex
a_i \text{ is element i in the sequence}\\
a_0 \text{ is the \textbf{head} of the List}\\
a_n \text{ is the \textbf{tail} of the List}\\
n \text{ is the \textbf{size} of the List}
```

## Operations

We shall define the following operations for the List A.D.T.:

```latex
\text{Let } L1 = < a, o, e, u, i >
```
* **Size(L)**           -> The number of elements in L
* **Get(L, i)**        -> The element of L at position i
* **Set(L, i, x)**      -> L’ with element i set to x
* **Insert(L, i, x)**   -> L’ with new element at position i    
* **Erase(L, i)**      -> L’ with element i removed
* **Find(L, x)**       -> _true_ if x is in L, _false_ otherwise


_#KnowledgeCheck: What will be the result of each operation below_
* Size(L1) -> ?
* Get(L1, 2) -> ?
* Set(L1, 1, y) -> ?
* Insert(L1, 1, y) -> ?
* Erase(L1, 3) -> ?
* Find(L1, h) -> ?

_Discussion Questions:_
* What similarities exist between a List and an Array?
* Which operations do they share?

Remember that an A.D.T. is a theoretical concept that has **nothing to do with C++ code**. Any structure, regardless of how it works or how it’s built, can be considered an implementation of a List as long as it can perform the above operations on a sequence of data.

---
## The Iterator

An _iterator_ is used to traverse and refer to specific pieces of data within a data structure without needing any knowledge of the internal structure. In C++, they provide an abstract interface that can be used alongside polymorphism to work with any specific implementation of a list.

**List-Iterator Functions:**
| Function | Use |
|----------|----------|
| Begin() | Returns iterator to the _first_ element |
| End() | Returns iterator to the _next-available_ position |
| Next(it, j) | Returns iterator j positions _beyond_ iterator _it_ |
| Prev(it, j) | Returns iterator j positions _before_ iterator _it_ |
| Advance(it, i) | Advances iterator i positions in the list* |

_*note: if i is negative, iterator moves backwards through the list_

Iterators commonly support increment/decrement (++/--) and can be used to access but not set values in a list

```c++
  List MyList;

  ...

  auto iter = MyList.Begin();
  while (iter != MyList.End())
  {
    cout << *iter << endl;  // printing vals
    iter++;  // next element
  }

  for (auto it = MyList.Begin(); it != MyList.End(); it++)
    cout << *it << endl; // For-Loop version
  }

```
---
# List Data Structures

Example Abstract Class _List_
```c++
template <typename T>
class List
{
  public:
    //OPERATIONS
    virtual int size() = 0;
    virtual void insert(ListIterator it, const T& val) = 0;
    virtual void erase(ListIterator it) = 0;
    virtual bool find(const T& val) = 0;
};
```

## C++ standard library implementations:
* Vector
* List

## Our Implementations:

[[ArrayList]] : Array-based implementation

[[LinkedList]] : Pointer-based implementation

