

Date: 2023-07-20
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=9509c7f7-9b4a-4038-8fac-b04601565186

Reminders:
* [x] PA05 due Sunday

Objectives:
* [x] Finish BinaryHeap implementation

---


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

# Class & Diagram

[[examples/binheap-class]]
<!-- #include [[examples/binheap-class]] -->
```c++
template <typename T>
class MaxBinaryHeap : public ArrayList<T>
{
  private:
    void siftDown(int start_index);
  public:
    void push(const T& val);
    void pop();
    const T& top();
}
```
<!-- /include -->


The fast random-access provided by an [[ArrayList]] is sufficient for implementing a heap/priority-queue.

---
# Operations

![class diagram](arraylist-diagram.png)

## GetMax (top)
[[examples/binheap-top]]
<!-- #include [[examples/binheap-top]] -->
```c++
template <typename T>
const T& MaxBinaryHeap<T>::top()
{
  return m_data[0];
}
```
<!-- /include -->

* [x] sarah
* [x] ben w

![](img/tree4.png)

## Sift-down
[[examples/binheap-siftdown]]
<!-- #include [[examples/binheap-siftdown]] -->
```c++
template <typename T>
void MaxBinaryHeap<T>::siftDown(int start_index)
{
  int curr_index = start_index;
  while( (2*curr_index +1) < m_size )  
  {
    int greater_child = 2*curr_index + 1;  // determine larger child
    if ((greater_child + 1 < m_size) 
        && (m_data[greater_child] < m_data[greater_child+1]))
      greater_child++;

    if ( m_data[curr_index] < m_data[greater_child] )
    {
      // swap if parent is smaller
      T temp = m_data[curr_index];
      m_data[curr_index] = m_data[greater_child];
      m_data[greater_child] = temp;
      curr_index = greater_child;
    }
    else
      return;
  }
}
```
<!-- /include -->

* [x] sarah

Given the i-th element of a binary heap (the element at index i),

Can you give a formula for the following?

  *  index of left-child : 2*i + 1
  *  index of right-child : 2*i + 2
  *  index of parent : (i-1)/2


## Enqueue (push)
[[examples/binheap-push]]
<!-- #include [[examples/binheap-push]] -->
```c++
template <typename T>
void MaxBinaryHeap<T>::push(const T& val)
{
  if (m_size == m_capacity)
    resize(m_capacity*2);

  m_data[m_size] = val;
  int curr = m_size;
  while(curr > 0 && ((curr - 1) / 2) < curr)
  {
      if(m_data[curr] > m_data[(curr - 1) / 2])
      {
          T temp = m_data[curr];
          m_data[curr] = m_data[(curr - 1) / 2];
          m_data[(curr - 1) / 2] = temp;
      }
      curr = (curr-1)/2;
  }
  m_size++;
}
```
<!-- /include -->

* [x] sarah

## Dequeue (pop)
[[examples/binheap-pop]]
<!-- #include [[examples/binheap-pop]] -->
```c++
template <typename T>
void MaxBinaryHeap<T>::pop()
{
  if(m_size == 0)
    throw std::out_of_range("Can't pop empty heap");
  
  m_data[0] = m_data[m_size - 1]; // Swap root with last element
  m_size--; // Remove last element
  siftdown(0); // Restore heap property

  if (m_size < m_capacity / 4)
    shrink();
}
```
<!-- /include -->


* [x] doug

## Heapify (Constructor from array)
[[examples/binheap-heapify]]

![](img/tree3.png)
<!-- #include [[examples/binheap-heapify]] -->
```c++
template <typename T>
MaxBinaryHeap<T>::MaxBinaryHeap(T *newData, int len)
{
  m_data = nullptr;
  m_size = 0;
  m_capacity = 0;
  resize(len);
  m_size = len;

  for(int i = 0; i < m_size; i++)  // load data into heap
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

---
# Default Member Functions

Are the [[ArrayList]] DFM sufficient for a Heap?

