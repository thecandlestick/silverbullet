
```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayStack
{
  private:
    int num_elems;       // # of elements currently stored
    int max_elems;   // length of storage array
    T *data;        // pointer to storage array
    void resize(int new_max_elems);
  public:
    ArrayStack() : num_elems (0), max_elems (MIN_CAPACITY) 
                { data = new T[max_elems]; } // default constructor

    //OPERATIONS
    T& top();
    void push(const T& x);
    void pop();
};
```

Consider the following stack:

  _top_ -> **< a0, a1, a2, ... , an >**

Can [[ArrayList]] operations efficiently implement _top_, _push_, and _pop_? 

