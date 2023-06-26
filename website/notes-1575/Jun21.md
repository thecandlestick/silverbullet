

Date: 2023-06-21
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=ffcaa239-eff3-480d-9141-b028013b4233

Reminders:
* [x] Quiz 1 due tonight

Objectives:
* [x] start LinkedList 

---

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
![class diagram](arraylist-diagram.png)
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

* [x] garret w
* [x] duc
* [x] sarah
* [x] tony


# LinkedList Class & Diagram

[[examples/linkedlist-class]]
<!-- #include [[examples/linkedlist-class]] -->
```c++
template <typename T>
class ListNode
{
  public:
    T m_data;  // single data item
    ListNode<T> *m_next;  // ptr to next node
}

template <typename T>
class LinkedList
{
  private:
    ListNode<T> *m_head;  // ptr to first node
    int m_size;
};
```
<!-- /include -->

![](img%2Flinklist-diagram.png)
* [x] ben
* [x] duc
* [x] matt
* [x] dheeraj

## Constructors

```c++
ListNode() { m_next = nullptr; }
ListNode(T data) { m_next = nullptr; m_data = data; }

LinkedList()
{
  m_head = new ListNode<T>; //invokes default constructor
  m_size = 0;
}
```


---

# Operations (member functions)

## Size

Due to the fact that a LinkedList has no _capacity_ for data storage to worry about, some implementations will skip this operation entirely. This makes it possible to implement a LinkedList using only a single C++ class.

## Get Pointer (auxiliary)
![linked list](img/linklist-diagram.png)

```c++
ListNode<T>* getNodePtr(int i)
{
  ListNode *runner = m_head;
  int counter = 0;
  while( counter < i && runner -> m_next != nullptr)
  {
    runner = runner->m_next; // "advance" the pointer to next node
    counter++;
  }

  if (runner -> m_next == nullptr) // we went too far
    return nullptr; // if sentinel node not desired

  return runner;
}
```

Unlike the ArrayList, the LinkedList lacks the _random access_ property meaning that the memory location of the _i-th_ element cannot be inferred simply from the index i. You must follow the chain of pointers to reach that piece of data.

This leads to a different convention for accessing data inside a LinkedList: the **iterator**.

In terms of a LinkedList, an iterator is essentially a pointer to an individual node, with some operations to allow for common use patterns such as advancing to the next node. By accepting an iterator instead of an index, our LinkedList functions can skip the initial _follow the chain_ step and simply jump straight to the relevant piece of data (which saves _time!_).
