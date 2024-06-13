---
tags: template
hooks.snippet.slashCommand: arraylist
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


## Re-size (Auxiliary Functions)

These functions change the size of the storage array pointed to by _data_. They allow us to continue adding more data when full, or to shrink our storage array so as to not waste memory.

[[examples/arraylist-resize]]



## Insert

[[examples/arraylist-insert]]


## Erase

[[examples/arraylist-erase]]



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