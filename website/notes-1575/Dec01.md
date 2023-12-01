

Date: 2023-12-01


Reminders:
* [ ]  [[PA06]] due next friday

Objectives:
* [ ] finish [[BinaryHeap]]
* [ ] introduce [[HashMap]]

---


## Heapify (Constructor from array)
[[examples/binheap-heapify]]
<!-- #include [[examples/binheap-heapify]] -->
```c++
template <typename T>
MaxBinaryHeap<T>::MaxBinaryHeap(T *newData, int len)
{
  data = nullptr;
  num_elems = 0;
  max_elems = 0;
  reserve(len);
  num_elems = len;

  for(int i = 0; i < num_elems; i++)  // load data into storage array
  {
      data[i] = newData[i];
  }
  
  int end = len - 1;
  int st = (end - 1) / 2;
  while(st >= 0)  // sift-down elements from level n-1 up to root
  {
      siftDown(st);
      st--;
  }

}
```
<!-- /include -->
_KC: Use the heapify constructor with the following array of data.
    Give the new ordering of the data after it is finished_

**ARRAY: << 5 , 10, 2, 23, 1, 12 >>**


---
# Default Member Functions

Are the [[ArrayList]] DFM sufficient for a Heap?

![ArrayList diagram](img/arrlist-diagram.png)
<!-- #include [[examples/arraylist-destructor]] -->
```c++
template <typename T>
ArrayList<T>::~ArrayList()
{
  delete [] data;
}
```
<!-- /include -->

<!-- #include [[examples/arraylist-assign-op]] -->
```c++
template <typename T>
const ArrayList& ArrayList<T>::operator=(const ArrayList& rhs)
{
  if (this != &rhs)
  {
    T *tmp = new T[rhs.max_elems];  // allocate enough space

    for(int k=0; k < rhs.num_elems; k++)
      tmp[k] = rhs.data[k];  // deep copy

    max_elems = rhs.max_elems;
    num_elems = rhs.num_elems;
    delete [] data;  // de-allocate old data
    data = tmp;  // redirect data pointer
  }

  return (*this);  // return calling object
}
```
<!-- /include -->

<!-- #include [[examples/arraylist-copy-constructor]] -->
```c++
template <typename T>
ArrayList<T>::ArrayList(const ArrayList& rhs)
{
  data = nullptr; // avoid dangling pointer
  *this = rhs;    // invoke operator=
}
```
<!-- /include -->


# The Map Abstract Data Type

A Map is an _unordered collection(set)_ of pairs. Each pair consists of a **key** and a **value**. 

{ <key1, val1>, <key2, val2>, ... , <keyn, valn> }

Keys in a Map must be _unique_ so that no two pairs have the same _key_, but there is no such restriction on _values_.

## Operations

- getValue(M, key) -> the value paired with _key_, if _key_ is in M
- setValue(M, key, value) -> M’ with updated pair _<key, value>_
- insert(M, key, value) ->  M’ with new pair _<key, value>_
- erase(M, key) -> M’ without pair identified by _key_
- find(M, key) -> true if _key_ in M, false otherwise


The motivation behind the Map is that unlike the List we do not need to maintain the order of the data. This allows us to strategically structure the data to optimize our operations as much as possible. This ADT also commonly goes by the name of _Dictionary_

---


# Map Data Structures

## C++ standard library implementations:
* [std::map](https://en.cppreference.com/w/cpp/container/map)
* [std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map)

## Our Implementations:

[[TreeMap]] - Memory-efficient implementation based on [[BST]]

[[HashMap]] - Time-efficient implementation based on associative arrays

| Complexity | Name |
|----------|----------|
| n! | factorial |
| 2^n | exponential |
| ... | ... |
| n^a | polynomial |
| n^3 | cubic |
| n^2 | quadratic |
| n*log(n) | linearithmic |
| n | linear |
| log(n) | logarithmic |
| 1 | constant |
