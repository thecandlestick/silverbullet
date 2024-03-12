---
tags: template
trigger: arrayqueue
---

Consider the following queue:

  _front_ -> **< a0, a1, a2, ... , an >** <- _back_

Can [[ArrayList]] operations efficiently implement _front, enqueue, dequeue?_ 

![ArrayList diagram](img/arrlist-diagram.png)

How might we re-engineer the ArrayQueue to make all 3 operations into constant-time algorithms?

  _front / head_ -> **< a0, a1, a2, ... , an >** <- _back / tail_ 

Offers quick enqueue operations, but dequeue requires shifting elements... _or does it..._ enter the _circular array_

[[examples/arrayqueue-class]]
<!-- #include [[examples/arrayqueue-class]] -->
```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayQueue
{
  private:
    int m_front;      // index-of start of valid data
    int m_back;       // index-of next available space   
    int m_capacity;   // length of storage array
    int m_size;       // # of valid data elements
    T *m_data;        // pointer to storage array
    void resize(int new_capacity);
  public:
    ArrayList() : m_front (0), m_back (0), m_capacity (MIN_CAPACITY) 
                { m_data = new T[m_capacity]; } // default constructor

    //OPERATIONS
    T& top();
    void enqueue(const T& value);
    void dequeue();
};
```
<!-- /include -->


[Visualization](https://www.cs.usfca.edu/~galles/visualization/QueueArray.html)


[[examples/arrayqueue-ops]]

