

Date: 2023-06-30
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=cfd53f40-fb59-418e-96ec-b03101371b44

Reminders:
* [x] Quiz 3 live

Objectives:
* [x] Queues

---


# Queues

## The Abstract Data Type Queue

A queue is a _sequence_ of elements of the same type

One end of the sequence is designated as the _front_, the other is the _back_. A queue follows a _first-in, first-out_ (FIFO) strategy where the data that has been in the sequence the longest is always the first to be removed.

### Operations:

_Let Q1 = < a, o, e, u, i >_
* front(Q) -> the front element of Q
  * front(Q1) -> a
    
* enqueue(Q, x) -> Q’ with new back element, x
  * enqueue(Q1, y) -> < a, o, e, u, i, y >
    
* dequeue(Q) -> Q’ with front element removed
  * dequeue(Q1) -> < o, e, u, i >

* [x] sarah
* [x] garret h
* [x] doug
* [x] makalyn
* [x] garret w


## Applications for Queues

* Scheduling problems
* Control of Peripherals
* Simulations
* etc.

## Queue Data Structures

[[ArrayQueue]]
[[LinkedQueue]]


Consider the following queue:

  _back_ / head -> **< a0, a1, a2, ... , an >** <- front / tail

Can [[ArrayList]] operations efficiently implement _front, enqueue, dequeue?_ 

* [x] sarah
* [x] garret w

![class diagram](arraylist-diagram.png)
* [x] makalyn
* [x] garret w
* [x] sarah

How might we re-engineer the ArrayQueue to make all 3 operations into constant-time algorithms?

  _front -> **< a0, a1, a2, ... , an >** <- _back 

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

* [x] garret w
* [x] makalyn
* [x] matt
* [x] sarah

[[examples/arrayqueue-ops]]
<!-- #include [[examples/arrayqueue-ops]] -->
```c++
template <typename T>
T& ArrayQueue<T>::front()
{
  return m_data[m_front];
}

template <typename T>
void ArrayQueue<T>::enqueue(const T& value)
{
  if (m_front == m_back && m_size != 0)
    resize(2*m_capacity);
  m_data[m_back] = value;
  m_back = (m_back+1) % m_capacity; //wrap around if necessary
  size++;
}

template <typename T>
void ArrayQueue<T>::dequeue()
{
  if (m_size > 0)
  {
    m_front = (m_front+1) % m_capacity; //wrap around if necessary
    m_size--;
  }
  if (m_size < 0.25*m_capacity)
    resize(0.5*m_capacity);
}
```
<!-- /include -->


Consider the following queue:

  _front_ -> **< a0, a1, a2, ... , an >** <- back

Can [[LinkedList]] operations efficiently implement _front, enqueue, dequeue?_ 

![linked list](img/linklist-diagram.png)

* [x] garret w
* [x] sarah

How might we re-engineer the LinkedQueue to make all 3 operations into constant-time algorithms?

* [x] dheeraj
* [x] duc

![](img%2Flinkq-diagram.png)

[[examples/linkedqueue-class]]

<!-- #include [[examples/linkedqueue-class]] -->
```c++
template <typename T>
class QueueNode
{
  public:
    T m_data;  // single data item
    QueueNode<T> *m_next;  // ptr to next node
}

template <typename T>
class LinkedQueue
{
  private:
    ListQueue<T> *m_sentinel;  // ptr to sentinel node
    int m_size;
  public:
  //OPERATIONS
    T& front();
    void enqueue(const T& value);
    void dequeue();
};
```
<!-- /include -->


[[examples/linkedqueue-ops]]



```c++
template <typename T>
T& LinkedQueue<T>::front()
{
  return m_sentinel -> m_next -> m_data;
}
```
![](img%2Flinkq-diagram.png)

```c++
template <typename T>
void LinkedQueue<T>::enqueue(const T& value)
{
  QueueNode<T> *new_sentinel = new QueueNode<T>;
  new_sentinel -> m_next = m_sentinel -> m_next;  // point to front

  m_sentinel -> m_data = value;
  m_sentinel -> m_next = new_sentinel; // old sentinel becomes back

  m_sentinel = new_sentinel; // redirect m_sentinel pointer
  m_size++;
}

template <typename T>
void LinkedQueue<T>::dequeue()
{
  QueueNode<T> *tmp = m_sentinel -> m_next; // point to front
  m_sentinel -> m_next = tmp -> m_next; // remove front from chain
  delete tmp;
  m_size--;
}
```


