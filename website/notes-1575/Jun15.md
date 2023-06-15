

Date: 2023-06-15
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=a7decaef-bc36-4d07-825b-b022013c8342

Reminders:
* [x] PA01 DUE FRIDAY

Objectives:
* [x] Introduce first ADT, List

---

ADT Abstract Data Type -  mathematical object together with operations

* [ ] matt
* [ ] sarah
* [ ] ryan
* [ ] makalyn

# The List Abstract Data Type

A List is a _sequence_ of elements of the same type

  < a_0, a_1, a_2, ... , a_n >  where:

* a_i is element _i_ in the sequence
* a_0 is the _head_ of the List
* a_n is the _tail_ of the List
* n is the _size_ of the List

## Operations

We shall define the following operations for the List A.D.T.:

_Let L1 = < a, o, e, u, i >_
* Size(L) -> The number of elements in L
  * Size(L1) -> 5
    
* Get(L, i) -> The element of L at position i
  * Get(L1, 2) -> e
    
* Set(L, i, x) -> L’ with element i set to x
  * Set(L1, 1, y) -> < a, y, e, u, i >
     
* Insert(L, i, x) -> L’ with new element at position i
  * Insert(L1, 1, y) -> < a, y, o, e, u, i >
    
* Remove(L, i) -> L’ with element i removed
  * Remove(L1, 3) -> < a, o, e, i >
    
* Find(L, x) -> _true_ if x is in L, _false_ otherwise
  * Find(L1, y) -> false

* [ ] sarah
* [ ] Duc
* [ ] Dheeraj
* [ ] tony
* [ ] makalyn
* [ ] makalyn


What similarities exist between a List and an Array?
Which operations do they share?

* [ ] tony
* [ ] duc
* [ ] garret
* [ ] daniel

Remember that an A.D.T. is a theoretical concept that has **nothing to do with C++ code**. Any structure, regardless of how it works or how it’s built, can be considered an implementation of a List as long as it can perform the above operations on a sequence of data.

---


# List Data Structures

## C++ standard library implementations:
* Vector
* List

## Our Implementations:

[[ArrayList]]

[[LinkedList]]



# ArrayList Class & Diagram

[[examples/arraylist-class]]
<!-- #include [[examples/arraylist-class]] -->
```c++
#define MIN_CAPACITY 8
template <typename T>
class ArrayList
{
  private:
    int size;       // # of elements currently stored
    int max_size;   // length of storage array
    T *data;        // pointer to storage array
    void resize(int new_max_size);
  public:
    ArrayList() : size (0), max (MIN_CAPACITY) { data = new T[max]; }

    //OPERATIONS
    T & operator[](int i);
    void insert(int i, const T& x);
    void erase(int i);
    bool find(const T& x);
    // ... 
};
```
<!-- /include -->


![class diagram](arrlist-class-diagram.png)
* [ ] garret
* [ ] jordan

---

# Operations (member functions)

## Size

```c++
template <typename T>
int ArrayList<T>::size()
{
  return size;
}

myArrayList.size();
```


* [ ] tony
* [ ] sarah

## Get/Set

In C++ classes, Get & Set can be bundled together!

data[i]


<!-- #include [[examples/arraylist-bracket-op]] -->
```c++
template <typename T>
T & ArrayList<T>::operator[](int i)
{
  // warning! no bounds-checking performed
  return data[i];
}
<!-- /include -->

* [ ] ryan
* [ ] tony
* [ ] joran
* [ ] duc

