```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayList
{
  private:
    int num_elems;       // # of elements currently stored
    int max_elems;   // length of storage array
    T *data;        // pointer to storage array
    void reserve(int new_capacity);
    void shrink_to_fit();
  public:
    ArrayList() : num_elems (0), max_elems (MIN_CAPACITY) 
                { data = new T[max_elems]; } // default constructor

    //OPERATIONS
    T & operator[](int index);
    T & at(int index);
    int size();
    int capacity();
    void insert(int index, const T& val);
    void erase(int index);
    bool find(const T& val);
    // ... 
};
```