```c++
#DEFINE MIN_CAPACITY = 8
template <typename T>
class ArrayList
{
  private:
    int size;
    int max;
    int *data;
  public:
    ArrayList() : size (0), max (MIN_CAPACITY) { data = new T[max]; }

    //OPERATIONS
    void insert(int i, const T& x);
    void remove(int i);
    bool find(const T& x);
    // ... 
};
```