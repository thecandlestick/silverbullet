---
date: 2024-07-02T00:00:00.000Z
---

```c++
template <typename T>
class StackNode
{
  public:
    T m_data;  // single data item
    StackNode<T> *m_next;  // ptr to next node
}

template <typename T>
class LinkedStack
{
  private:
    StackNode<T> *m_head;  // ptr to first node
    int m_size;
  public:
    //OPERATIONS
    T& top();
    void push(const T& x);
    void pop();
};
```

Consider the following stack:

  _top/head_ -> **< a0, a1, a2, ... , an >** <- tail

Can [[LinkedList]] operations efficiently implement _top_, _push_, and _pop_? 



**Top** O(1)



**Push** O(1)



**Pop** O(1)



