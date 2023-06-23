

Date: 2023-06-16
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=39871011-fa2d-4cf1-8a9d-b0230138cef8

Reminders:
* [x] check stdio_tests
* [x] PA01 due tonight

Objectives:
* [x] Continue ArrayList implementation

---


# ArrayList Class & Diagram

[[examples/arraylist-class]]
<!-- #include [[examples/arraylist-class]] -->
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
<!-- /include -->


![class diagram](arrlist-class-diagram.png)

---

# Operations (member functions)

## Size

```c++
template <typename T>
int ArrayList<T>::size()
{
  return size;
}

myArrayList.size();
```


## Get/Set

In C++ classes, Get & Set can be bundled together!


<!-- #include [[examples/arraylist-bracket-op]] -->
```c++
template <typename T>
T & ArrayList<T>::operator[](int i)
{
  // warning! no bounds-checking performed
  return data[i];
}
<!-- /include -->

## Resize (Auxiliary Function)
![class diagram](arrlist-class-diagram.png)
[[examples/arraylist-resize]]

1. create a temp array of new size  < T* tmp = new T[new_max_size]; >
2. copy data over < use a for loop >
3. delete old storage arr
4. make data ptr point to new storage array < data = tmp >

<!-- #include [[examples/arraylist-resize]] -->
```c++
template <typename T>
void ArrayList<T>::resize(int new_capacity)
{
  //Allocate new storage array
  T* temp = new T[new_capacity];
  //Perform a deep copy of the data
  for(int k=0; k < size; k++)
    temp[k] = data[k];
  //De-allocate old storage array
  delete [] data;
  //Redirect data pointer
  data = tmp;
  //Update capacity
  capacity = new_capacity;
}
```
<!-- /include -->



data = new T[new_max_size];
* [x] tony
* [x] sarah
* [x] duc
* [x] dheeraj

## Insert
![class diagram](arrlist-class-diagram.png)
1. check if resize needed
2. 0 <= i <= size
3. “shift” data by copying right to left
   4. insert new data item
   5. increase size
   
[[examples/arraylist-insert]]
* [x] sarah
* [x] matt
* [x] garret
* [x] jordan
* [x] duc
* [x] tony

<!-- #include [[examples/arraylist-insert]] -->
```c++
template <typename T>
void ArrayList<T>::insert(int i, const T& x)
{
  if (0 <= i && i <= size)
  {
    if (size == capacity)
      resize(capacity*2);
    for(int k=size; k > i; k--)
      data[k] = data[k-1];
    
    data[i] = x;
    size++:
  }
  else
    // ...
}
```
<!-- /include -->


## Remove
* [x] duc
* [x] dheeraj
* [x] matt
      
![class diagram](arrlist-class-diagram.png)1. check 0 <= i < size
2. “shift” data left to right
3. decrease size
4. check if resize needed

[[examples/arraylist-remove]]

<!-- #include [[examples/arraylist-remove]] -->
```c++
template <typename T>
void ArrayList<T>::remove(int i)
{  
  if ( 0 <= i && i < size )
  {
    for(int k=i; k < size-1 ; k++)
      data[k] = data[k+1];
    
    size--;
    if( size < capacity / 4 )
      resize(capacity / 2);
  }
  else
    // ...
}
```
<!-- /include -->


## Find

[[examples/arraylist-find]]
<!-- #include [[examples/arraylist-find]] -->
```c++
template <typename T>
bool ArrayList<T>::find(const T &x)
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

## Operator=

[[examples/arraylist-assign-op]]

## Copy Constructor

[[examples/arraylist-copy-constructor]]
