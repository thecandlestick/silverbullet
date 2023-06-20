```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayList
{
  private:
    int size;       // # of elements currently stored
    int capacity;   // length of storage array
    T *data;        // pointer to storage array
    void resize(int new_capacity);
  public:
    ArrayList() : size (0), capacity (MIN_CAPACITY) 
                { data = new T[capacity]; } // default constructor

    //OPERATIONS
    T & operator[](int i);
    void insert(int i, const T& x);
    void erase(int i);
    bool find(const T& x);
    // ... 
};
```