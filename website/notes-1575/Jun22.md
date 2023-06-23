

Date: 2023-06-22
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=3ec00891-1e5e-4710-b85e-b0290141a4bc

Reminders:
* [ ] PA02 released

Objectives:
* [ ] Continue LinkedLists

---


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



## Get / Set

const T& get(ListNode<T>* p)
{ ...

  return p -> m_data;
}

* [ ] sarah
* [ ] tony
* [ ] Ben

[[examples/linkedlist-get-set]]
<!-- #include [[examples/linkedlist-get-set]] -->
```c++
template <typename T>
const T& LinkedList<T>::get( ListNode<T> *p )
{
  return p -> m_data;
}

template <typename T>
void LinkedList<T>::set( ListNode<T> *p )
{
  p -> m_data = x;
}
```
<!-- /include -->

## Insert
[[examples/linkedlist-insert]]
![linked list](img/linklist-diagram.png)

* [ ] duc
* [ ] matt
* [ ] tony
* [ ] sarah
* [ ] garret h
* [ ] Ben

<!-- #include [[examples/linkedlist-insert]] -->
```c++
template <typename T>
void LinkedList<T>::insert(ListNode<T> *p, const T& x)
{
  ListNode<T> *tmp = new ListNode<T>;
  tmp -> m_data = p -> m_data;
  tmp -> m_next = p -> m_next;
  p -> m_data = x;
  p -> m_next = tmp;
  m_size++;
}
```
<!-- /include -->


## Remove
[[examples/linkedlist-remove]]
![linked list](img/linklist-diagram.png)




