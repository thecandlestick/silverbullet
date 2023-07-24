
# The Priority Queue Abstract Data Type

A Prioriry Queue is a collection of data, together with a _function_ mapping each element to its _priority_.

{ <val1>, <val2>, ... , <val_n> }

A Priority Queue differs from the standard Queue ADT follows a strategy where only the element with the **highest priority** is accessible. Since elements can be added to a Priority Queue in any order, a [[Heaps|Heap]] structure is most often used to avoid expensive searching for the highest priority.

## Operations

* getMax(PQ) -> the element of PQ with highest priority
* enqueue(PQ, value) -> PQ’ with new element _value_
* dequeue(PQ) -> PQ’ with highest priority element removed


---


# Priority Queue Data Structures

## C++ standard library implementations:
  * [std::priority_queue](https://en.cppreference.com/w/cpp/container/priority_queue)

## Our Implementations:

[[BinaryHeap]]

