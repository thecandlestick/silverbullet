

Date: 2023-09-20


Reminders:
* [ ]  [[PA01]] due midnight

Objectives:
* [ ] introducing [[Lists]]

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
n+1 \text{ is the \textbf{size} of the List}
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


_KC: What will be the result of each operation below_
* Size(L1) -> 5
* Get(L1, 2) -> e
* Set(L1, 1, y) -> < a, y, e, u, i >
* Insert(L1, 1, y) -> <a, y, o, e, u, i >
* Erase(L1, 3) -> < a, o, e, i >
* Find(L1, h) -> false

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
* forward_list

## Our Implementations:

[[ArrayList]] : Array-based implementation

[[LinkedList]] : Pointer-based implementation


# ArrayList Class & Diagram

The key idea behind the ArrayList/Vector is to use a dynamically-allocated _storage array_ that can be re-sized as necessary

[[examples/arraylist-class]]
<!-- #include [[examples/arraylist-class]] -->
```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayList
{
  private:
    int num_elems;       // # of elements currently stored
    int max_elems;   // length of storage array
    T *data;        // pointer to storage array
    void reserve(int new_capacity);
    void shrink_to_fit();
  public:
    ArrayList() : num_elems (0), max_elems (MIN_CAPACITY) 
                { data = new T[max_elems]; } // default constructor

    //OPERATIONS
    T & operator[](int index);
    T & at(int index);
    int size();
    int capacity();
    void insert(int index, const T& val);
    void erase(int index);
    bool find(const T& val);
    // ... 
};
```
<!-- /include -->


![class diagram](img/arrlist-diagram.png)


---

# Operations (member functions)

## Size

```c++
template <typename T>
int ArrayList<T>::size()
{
  return num_elems;
}

myArrayList.size();
```


## Get/Set

In C++ classes, Get & Set can be bundled together!

[[examples/arraylist-bracket-op]]
<!-- #include [[examples/arraylist-bracket-op]] -->
```c++
template <typename T>
T & ArrayList<T>::operator[](int index)
{
  // warning! no bounds-checking performed
  return data[index];
}

template <typename T>
T & ArrayList<T>::at(int index)
{
  if (0 <= index && index < num_elems)
    return data[index];
  else
    throw std::out_of_range("At: index out of range");
}
```
<!-- /include -->

