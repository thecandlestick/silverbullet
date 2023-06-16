```c++
#define MIN_CAPACITY 8
template <typename T>
class ArrayList
{
  private:
    int size;       // # of elements currently stored
    int max_size;   // length of storage array
    T *data;        // pointer to storage array
    void resize(int new_max_size);
  public:
    ArrayList() : size (0), max_size (MIN_CAPACITY) 
                { data = new T[max]; } // default constructor

    //OPERATIONS
    T & operator[](int i);
    void insert(int i, const T& x);
    void erase(int i);
    bool find(const T& x);
    // ... 
};
```