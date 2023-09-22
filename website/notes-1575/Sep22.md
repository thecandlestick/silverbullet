

Date: 2023-09-22


Reminders:
* [ ]  enjoy your weekend

Objectives:
* [ ] continuing [[ArrayList]]

---


# ArrayList Class & Diagram

The key idea behind the ArrayList/Vector is to use a dynamically-allocated _storage array_ that can be re-sized as necessary

[[examples/arraylist-class]]


![class diagram](img/arrlist-diagram.png)


---

# Operations (member functions)

## Size

```c++
template <typename T>
int ArrayList<T>::size()
{
  return num_elems;
}

myArrayList.size();
```


## Get/Set

In C++ classes, Get & Set can be bundled together!

[[examples/arraylist-bracket-op]]
![ArrayList diagram](img/arrlist-diagram.png)
<!-- #include [[examples/arraylist-bracket-op]] -->
```c++
template <typename T>
T & ArrayList<T>::operator[](int index)
{
  // warning! no bounds-checking performed
  return data[index];
}

template <typename T>
T & ArrayList<T>::at(int index)
{
  if (0 <= index && index < num_elems)
    return data[index];
  else
    throw std::out_of_range("At: index out of range");
}
```
<!-- /include -->


## Re-size (Auxiliary Functions)

These functions change the size of the storage array pointed to by _data_. They allow us to continue adding more data when full, or to shrink our storage array so as to not waste memory.

[[examples/arraylist-resize]]
<!-- #include [[examples/arraylist-resize]] -->
```c++
// Allocates a larger storage array
template <typename T>
void ArrayList<T>::reserve(int new_capacity)
{
  //Allocate new storage array
  T* temp = new T[new_capacity];
  //Perform a deep copy of the data
  for(int k=0; k < num_elems; k++)
    temp[k] = data[k];
  //De-allocate old storage array
  delete [] data;
  //Redirect data pointer
  data = tmp;
  //Update capacity
  max_elems = new_capacity;
}

// Releases ALL unused memory
void ArrayList<T>::shrink_to_fit()
{
  //Allocate new storage array
  T* temp = new T[num_elems];
  //Perform a deep copy of the data
  for(int k=0; k < num_elems; k++)
    temp[k] = data[k];
  //De-allocate old storage array
  delete [] data;
  //Redirect data pointer
  data = tmp;
  //Update capacity
  max_elems = num_elems;
}
```
<!-- /include -->



## Insert

[[examples/arraylist-insert]]
<!-- #include [[examples/arraylist-insert]] -->
```c++
template <typename T>
void ArrayList<T>::insert(int index, const T& val)
{
  // Bounds-Checking
  if (0 <= index && index <= num_elems)
  {
    // Is storage array at capacity?
    if (num_elems == max_elems)
      reserve(max_elems*2);
    // Right-shift data to make room for insertion
    for(int k=num_elems; k > index; k--)
      data[k] = data[k-1];

    // Inserting desired value
    data[index] = val;
    num_elems++:
  }
  else
    throw std::out_of_range("Insert: index out of range");
}
```
<!-- /include -->


## Erase

[[examples/arraylist-remove]]



## Find

[[examples/arraylist-find]]



---

# Default Member Functions

## Destructor

[[examples/arraylist-destructor]]

## Operator=

[[examples/arraylist-assign-op]]

## Copy Constructor

[[examples/arraylist-copy-constructor]]
<!-- /include -->
