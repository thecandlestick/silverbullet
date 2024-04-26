---
tags: template
trigger: binary-heap
---

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

_Note:_
In the c++ standard library, inheritance is not used to create a priority queue from existing structures. A concept known as _adapters_ are used instead. See https://en.cppreference.com/w/cpp/container for reference

---
# Operations

## GetMax (top)
[[examples/binheap-top]]

## Sift-down
[[examples/binheap-siftdown]]

## Enqueue (push)
[[examples/binheap-push]]

## Dequeue (pop)
[[examples/binheap-pop]]

## Heapify (Constructor from array)
[[examples/binheap-heapify]]

_KC: Use the heapify constructor with the following array of data.
    Give the new ordering of the data after it is finished_

**ARRAY: << 5 , 10, 2, 23, 1, 12 >>**


---
# Default Member Functions

Are the [[ArrayList]] DFM sufficient for a Heap?