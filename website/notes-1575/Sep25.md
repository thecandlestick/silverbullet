

Date: 2023-09-25


Reminders:
* [ ]  

Objectives:
* [ ] Continue [[ArrayList]]

---


## Erase

[[examples/arraylist-erase]]
<!-- #include [[examples/arraylist-erase]] -->
```c++
template <typename T>
void ArrayList<T>::erase(int index)
{  
  // Bounds-checking
  if ( 0 <= index && index < num_elems )
  {
    // Left-shift data to overwrite unwanted data
    for(int k=index; k < num_elems-1 ; k++)
      data[k] = data[k+1];
    
    num_elems--;
  }
  else
    throw std::out_of_range("Erase: index out of range");
}
```
<!-- /include -->



## Find

[[examples/arraylist-find]]
<!-- #include [[examples/arraylist-find]] -->
```c++
template <typename T>
bool ArrayList<T>::find(const T &val)
{
  for(int k=0; k < num_elems; k++)
    if ( data[k] == val )
      return true; // val has been found
  
  return false;  // list does not contain val
}
```
<!-- /include -->



---

# Default Member Functions

## Destructor

[[examples/arraylist-destructor]]
<!-- #include [[examples/arraylist-destructor]] -->
```c++
template <typename T>
ArrayList<T>::~ArrayList()
{
  delete [] data;
}
```
<!-- /include -->


## Operator=

[[examples/arraylist-assign-op]]
<!-- #include [[examples/arraylist-assign-op]] -->
```c++
template <typename T>
const ArrayList& ArrayList<T>::operator=(const ArrayList& rhs)
{
  if (this != &rhs)
  {
    T *tmp = new T[rhs.max_elems];  // allocate enough space

    for(int k=0; k < rhs.num_elems; k++)
      tmp[k] = rhs.data[k];  // deep copy

    max_elems = rhs.max_elems;
    num_elems = rhs.num_elems;
    delete [] data;  // de-allocate old data
    data = tmp;  // redirect data pointer
  }

  return (*this);  // return calling object
}
```
<!-- /include -->



## Copy Constructor

[[examples/arraylist-copy-constructor]]
<!-- #include [[examples/arraylist-copy-constructor]] -->
```c++
template <typename T>
ArrayList<T>::ArrayList(const ArrayList& rhs)
{
  data = nullptr; // avoid dangling pointer
  *this = rhs;    // invoke operator=
}
```
<!-- /include -->
