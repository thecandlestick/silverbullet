
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

  _top_ -> **< a0, a1, a2, ... , an >**

Can [[LinkedList]] operations efficiently implement _top_, _push_, and _pop_? 
