```c++
#define MIN_CAPACITY 8
template <typename T>
class ArrayList
{
  private:
    int size;
    int max_size;
    int *data;
  public:
    ArrayList() : size (0), max (MIN_CAPACITY) { data = new T[max]; }

    //OPERATIONS
    T & operator[](int i);
    void insert(int i, const T& x);
    void erase(int i);
    bool find(const T& x);
    // ... 
};
```