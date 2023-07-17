
# The Priority Queue Abstract Data Type

A Prioriry Queue is a collection of data, together with a _function_ mapping each element to its _priority_.

{ <val1>, <val2>, ... , <val_n> }

The function used for priorities must provide a **weak ordering** of the data. In informal terms, this simply means that not all elements need to be directly _comparable_ so long as the function used is _transitive_ (if a > b && b > c then a > c).

A weak ordering of the data is sufficient because a Priority Queue follows a strategy where only the element with the **highest priority** is accessible.

## Operations

* getMax(PQ) -> the element of PQ with highest priority
* push(PQ, value) -> PQ’ with new element _value_
* pop(PQ) -> PQ’ with highest priority element removed


---


# Map Data Structures

## C++ standard library implementations:
  * [std::priority_queue](https://en.cppreference.com/w/cpp/container/priority_queue)

## Our Implementations:

[[ArrayHeap]]