# ArrayList Class & Diagram

[[examples/arraylist-class]]
<!-- #include [[examples/arraylist-class]] -->
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
<!-- /include -->

---

# Operations (member functions)

## Size

## Get/Set

## Insert

[[examples/arraylist-insert]]
<!-- #include [[examples/arraylist-insert]] -->
```c++
void ArrayList::insert(int i, const T& x)
{
  if (0 <= i && i <= size)
  {
    if (size == max)
      resize(max*2);
    for(int k=size; k > i; k--)
      data[k] = data[k-1];
    
    data[i] = x;
    size++:
  }
}
```
<!-- /include -->

## Remove

[[examples/arraylist-remove]]
<!-- #include [[examples/arraylist-remove]] -->
```c++
void ArrayList::erase(int i)
{  
  if ( 0 <= i && i < size )
  {
    for(int k=i; k < size-1 ; k++)
      data[k] = data[k+1];
    
    size--;
    if( size < max / 4 )
      resize(max / 2);
  }
}
```
<!-- /include -->

## Find

[[arraylist-find]]
<!-- #include [[arraylist-find]] -->
```c++
bool ArrayList::find(const T &x)
{
  for(int k=0; k < size; k++)
    if ( data[k] == x )
      return true; // x has been found
  
  return false;  // list does not contain x
}
```
<!-- /include -->

---

# Default Member Functions

## Destructor

[[examples/arraylist-destructor]]
<!-- #include [[examples/arraylist-destructor]] -->
```c++
ArrayList::~ArrayList()
{
  delete [] data;
}
```
<!-- /include -->

## Operator=

[[examples/arraylist-assign-op]]
<!-- #include [[examples/arraylist-assign-op]] -->
```c++
const ArrayList& ArrayList::operator=(const ArrayList& rhs)
{
  if (this != &rhs)
  {
    T *tmp = new T[rhs.max];  // allocate enough space for rhs data
    for(int k=0; k < rhs.size; k++)
      tmp.data[k] = rhs.data[k];  // deep copy
    max = rhs.max;
    size = rhs.size;
    delete [] data;  // de-allocate old data
    data = tmp;
  }

  return (*this);
}
```
<!-- /include -->


## Copy Constructor

[[examples/arraylist-copy-constructor]]
<!-- #include [[examples/arraylist-copy-constructor]] -->
```c++
ArrayList::ArrayList(const ArrayList& rhs)
{
  data = nullptr; // avoid dangling pointer
  *this = rhs;    // invoke operator=
}
```
<!-- /include -->
