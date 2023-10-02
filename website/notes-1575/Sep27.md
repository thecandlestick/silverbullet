

Date: 2023-09-27


Reminders:
* [ ]  

Objectives:
* [ ] introduce [[LinkedList]]

---


# LinkedList Class & Diagram

[[examples/linkedlist-class]]
<!-- #include [[examples/linkedlist-class]] -->
```c++
template <typename T>
class ListNode
{
  public:
    T data;  // single data item
    ListNode<T> *next;  // ptr to next node
}

template <typename T>
class LinkedList
{
  private:
    ListNode<T> *head;  // ptr to first node
    int size;
};
```
<!-- /include -->


![](img/LL-diagram.png)

## Constructors

```c++
ListNode() { next = nullptr; }
ListNode(T value) { next = nullptr; data = value; }

LinkedList()
{
  head = new ListNode<T>; //invokes default constructor
  size = 0;
}
```


---

# Operations (member functions)

## Size

Due to the fact that a LinkedList has no _capacity_ for data storage to worry about, some implementations will skip this operation entirely. This makes it possible to implement a LinkedList using only a single C++ class.

---

## Iterators

Unlike the ArrayList, the LinkedList lacks the _random access_ property meaning that the memory location of the _i-th_ element cannot be inferred simply from the index i. You must follow the chain of pointers to reach that piece of data.

This leads to a different convention for accessing data inside a LinkedList: the **iterator**.

In terms of a LinkedList, an iterator is essentially a pointer to an individual node, with some operations to allow for common use patterns such as advancing to the next node. By accepting an iterator instead of an index, our LinkedList functions can skip the initial _follow the chain_ step and simply jump straight to the relevant piece of data (which saves _time!_).

```c++
template <typename T>
class LinkedListIterator
{
  ListNode<T>* ptr; // pointer to a node in the list
  public:
    LinkedListIterator(ListNode<T>* p) {ptr = p;} // constructor
    ListNode<T>* operator* {return *ptr;} 
    // de-referencing iterator gives access to the current node
};
```

Supposing we have an iterator, we need to tackle the challenge of _advancing_ that iterator. That is to say, how can we make it refer to the _next_ node in the list?

```c++
template <typename T>
void LinkedListIterator<T>::operator+(int increment)
{
  int hops = 0;
  while( hops < increment && ptr != nullptr)
  {
    ptr = ptr->next; // "advance" the pointer to next node
    hops++;
  }
}
```

_KC: The begin() and end() functions create iterators to the front (first node) and back (sentinel node), respectively. Complete the code below to implement these for a LinkedList_

```c++
template <typename T>
LinkedListIterator<T> LinkedList<T>::begin()
{
  return LinkedListIterator<T>(head);
}
```

```c++
template <typename T>
LinkedListIterator<T> LinkedList<T>::end()
{
  ListNode<T> *runner = head; // create a pointer to advance
  while(___)
  {
    runner = runner->next; // "advance" the pointer to next node
  }
  return LinkedListIterator<T>(runner); // create iter from pointer
}
```
