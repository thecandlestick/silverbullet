

Date: 2023-11-29


Reminders:
* [ ]  [[pa06]] assigned
* [ ]  IT RSS hiring (handshake)

Objectives:
* [ ] introduce [[BinaryHeap]]

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

![ArrayList diagram](img/arrlist-diagram.png)
The fast random-access provided by an [[ArrayList]] is sufficient for implementing a heap/priority-queue.

---
# Operations

## GetMax (top)
[[examples/binheap-top]]

<!-- #include [[examples/binheap-top]] -->
```c++
template <typename T>
const T& MaxBinaryHeap<T>::top()
{
  return data[0];
}
```
<!-- /include -->


## Sift-down
[[examples/binheap-siftdown]]

<!-- #include [[examples/binheap-siftdown]] -->
```c++
template <typename T>
void MaxBinaryHeap<T>::siftDown(int start_index)
{
  int curr_index = start_index;
  while( (2*curr_index +1) < num_elems )  // stop if curr_index is leaf
  {
    int greater_child = 2*curr_index + 1;  // determine larger child
    if ((greater_child + 1 < num_elems) 
        && (data[greater_child] < data[greater_child+1]))
      greater_child++;

    if ( data[curr_index] < data[greater_child] )
    {
      // swap if parent is smaller
      T temp = data[curr_index];
      data[curr_index] = data[greater_child];
      data[greater_child] = temp;
      curr_index = greater_child;
    }
    else
      return; // stop if max-heap property is satisfied
  }
}
```
<!-- /include -->



## Enqueue (push)
[[examples/binheap-push]]
<!-- #include [[examples/binheap-push]] -->
```c++
template <typename T>
void MaxBinaryHeap<T>::push(const T& val)
{
  if (num_elems == max_elems)
    reserve(max_elems*2);

  data[num_elems] = val; // start val at first-available space 
  int curr = num_elems;
  T temp;
  while(curr > 0 && (data[curr] > data[(curr - 1) / 2]))
  // sift-up to restore heap-property
  {
      temp = data[curr];
      data[curr] = data[(curr - 1) / 2];
      data[(curr - 1) / 2] = temp;
      curr = (curr-1)/2;
  }
  num_elems++;
}
```
<!-- /include -->



## Dequeue (pop)
[[examples/binheap-pop]]
<!-- #include [[examples/binheap-pop]] -->
```c++
template <typename T>
void MaxBinaryHeap<T>::pop()
{
  if(num_elems == 0)
    throw std::out_of_range("Can't pop empty heap");
  
  data[0] = data[num_elems - 1]; // Swap root with last element
  num_elems--; // Remove last element
  siftdown(0); // Restore heap property

  if (num_elems < max_elems / 4)
    shrink_to_fit();
}
```
<!-- /include -->

