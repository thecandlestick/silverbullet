
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
  * Size(L1) -> ?
    
* Get(L, i) -> The element of L at position i
  * Get(L1, 2) -> ?
    
* Set(L, i, x) -> L’ with element i set to x
  * Set(L1, 1, y) -> ?
     
* Insert(L, i, x) -> L’ with new element at position i
  * Insert(L1, 1, y) -> ?
    
* Remove(L, i) -> L’ with element i removed
  * Remove(L1, 3) -> ?
    
* Find(L, x) -> _true_ if x is in L, _false_ otherwise


What similarities exist between a List and an Array?
Which operations do they share?

Remember that an A.D.T. is a theoretical concept that has **nothing to do with C++ code**. Any structure, regardless of how it works or how it’s built, can be considered an implementation of a List as long as it can perform the above operations on a sequence of data.

---


# List Data Structures

## C++ standard library implementations:
* Vector
* List

## Our Implementations:

[[ArrayList]]

[[LinkedList]]