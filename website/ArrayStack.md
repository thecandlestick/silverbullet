
```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayStack
{
  private:
    int m_size;       // # of elements currently stored
    int m_capacity;   // length of storage array
    T *m_data;        // pointer to storage array
    void resize(int new_capacity);
  public:
    ArrayStack() : m_size (0), m_capacity (MIN_CAPACITY) 
                { m_data = new T[m_capacity]; } // default constructor

    //OPERATIONS
    T& top();
    void push(const T& x);
    void pop();
};
```

Consider the following stack:

  _top_ -> **< a0, a1, a2, ... , an >**

Can [[ArrayList]] operations efficiently implement _top_, _push_, and _pop_? 

