---
tags:
  - template
trigger: arrayqueue
date: 2024-07-02T00:00:00.000Z
---

Consider the following queue:

  _front/head_ -> **< a0, a1, a2, ... , an >** <- _back/tail_

Can [[ArrayList]] operations efficiently implement _front, enqueue, dequeue?_ 

**Front** O(1)

return data[0];

**Enqueue** O(1)

data[num_elems] = val

**Dequeue** O(n)

shift data left

_back/head_ -> **< a0, a1, a2, ... , an >** <- _front/tail_

**Front** O(1)

return data[num_elems-1];

**Enqueue** O(n)

shift data right

**Dequeue** O(1)

num_elems--;


* [ ] brileigh, raylynn, rae  📅2024-07-02 #cs1575EC

How might we re-engineer the ArrayQueue to make all 3 operations into constant-time algorithms?

  _front / head_ -> **< a0, a1, a2, ... , an >** <- _back / tail_ 

Offers quick enqueue operations, but dequeue requires shifting elements... _or does it..._ enter the _circular array_

[[examples/arrayqueue-class]]
```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayQueue
{
  private:
    int m_front;      // index-of start of valid data
    int m_back;       // index-of next available space   
    int max_elems;   // length of storage array
    int num_elems;       // # of valid data elements
    T *data;        // pointer to storage array
    void resize(int new_capacity);
  public:
    ArrayList() : m_front (0), m_back (0), max_elems (MIN_CAPACITY) 
                { data = new T[max_elems]; } // default constructor

    //OPERATIONS
    T& top();
    void enqueue(const T& value);
    void dequeue();
};
```



[Visualization](https://www.cs.usfca.edu/~galles/visualization/QueueArray.html)


[[examples/arrayqueue-ops]]

