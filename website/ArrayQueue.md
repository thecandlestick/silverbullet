---
tags:
  - template
hooks.snippet.slashCommand: arrayqueue
date: 2024-07-02T00:00:00.000Z
---

Consider the following queue:

 **< a0, a1, a2, ... , an >**

Can [[ArrayList]] operations efficiently implement _front, enqueue, dequeue?_ 

## Case 1 (sequence-order)

  _front_ -> **< a0, a1, a2, ... , an >** <- _back_

**Front** O(?)

**Enqueue** O(?)

**Dequeue** O(?)


## Case 2 (reverse sequence-order)

  _back_ -> **< a0, a1, a2, ... , an >** <- _front_

**Front** O(?)

**Enqueue** O(?)

**Dequeue** O(?)


Either way requires shifting elements... _or does it..._ enter the _circular array_

---

## Circular Array


[[examples/arrayqueue-class]]
```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayQueue
{
  private:
    int front;      // index-of start of valid data
    int back;       // index-of next available space   
    int max_elems;   // length of storage array
    int num_elems;       // # of valid data elements
    T *data;        // pointer to storage array
    void resize(int new_capacity);
  public:
    ArrayList() : front (0), back (0), max_elems (MIN_CAPACITY) 
                { data = new T[max_elems]; } // default constructor

    //OPERATIONS
    T& top();
    void enqueue(const T& value);
    void dequeue();
};
```



[Visualization](https://www.cs.usfca.edu/~galles/visualization/QueueArray.html)


[[examples/arrayqueue-ops]]

