

Date: 2023-10-02


Reminders:
* [ ]  PA02 due next friday

Objectives:
* [ ] continue linkedlists

---


![linked list](img/LL-diagram.png)
## Get / Set

[[examples/linkedlist-get-set]]
<!-- #include [[examples/linkedlist-get-set]] -->
```c++
template <typename T>
const T& LinkedList<T>::get( LinkedListIterator<T> it )
{
  return it -> data;
}

template <typename T>
void LinkedList<T>::set( LinkedListIterator<T> it, const T& value )
{
  it -> data = value;
}
```
<!-- /include -->


## Insert
[[examples/linkedlist-insert]]
<!-- #include [[examples/linkedlist-insert]] -->
```c++
template <typename T>
void LinkedList<T>::insert(LinkedListIterator<T> it, const T& value)
{
  ListNode<T> *tmp = new ListNode<T>;
  tmp -> data = it -> data;
  tmp -> next = it -> next;
  it -> data = value;
  it -> next = tmp;
  size++;
}
```
<!-- /include -->


Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20void%20insert%28ListNode%20*p,%20const%20int%26%20x%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.insert%28p,%204%29%3B%0A%20%20p%20%3D%20p%20-%3E%20m_next%3B%0A%20%20mylist.insert%28p,%208%29%3B%0A%20%20mylist.insert%28p,%206%29%3B%0A%20%20%0A%20%20return%200%3B%0A%7D%0A%0Avoid%20LinkedList%3A%3Ainsert%28ListNode%20*p,%20const%20int%26%20x%29%0A%7B%0A%20%20ListNode%20*tmp%20%3D%20new%20ListNode%3B%0A%20%20tmp%20-%3E%20m_data%20%3D%20p%20-%3E%20m_data%3B%0A%20%20tmp%20-%3E%20m_next%20%3D%20p%20-%3E%20m_next%3B%0A%20%20p%20-%3E%20m_data%20%3D%20x%3B%0A%20%20p%20-%3E%20m_next%20%3D%20tmp%3B%0A%20%20m_size%2B%2B%3B%0A%7D&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation

## Erase
[[examples/linkedlist-erase]]
<!-- #include [[examples/linkedlist-erase]] -->
```c++
template <typename T>
void erase( LinkedListIterator<T> it )
{
  ListNode<T> *tmp = it -> next;
  it -> data = tmp -> data;
  it -> next = tmp -> next;
  delete tmp;
  size--;
}
```
<!-- /include -->


Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%20%20%20%20ListNode%28int%20data%29%20%7B%20m_next%20%3D%20nullptr%3B%20m_data%20%3D%20data%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20void%20erase%28%20ListNode%20*p%20%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20//%20SKIP%20TO%20%20step%20~20%20for%20erase%0A%20%20mylist.m_size%20%3D%202%3B%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.m_head%20%3D%20new%20ListNode%285%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20%3D%20new%20ListNode%2810%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20-%3E%20m_next%20%3D%20p%3B%0A%20%20p%20%3D%20mylist.m_head%20-%3E%20m_next%3B%0A%20%20mylist.erase%28p%29%3B%0A%20%20%0A%20%20return%200%3B%0A%7D%0A%0Avoid%20LinkedList%3A%3Aerase%28%20ListNode%20*p%20%29%0A%7B%0A%20%20ListNode%20*tmp%20%3D%20p%20-%3E%20m_next%3B%0A%20%20p%20-%3E%20m_data%20%3D%20tmp%20-%3E%20m_data%3B%0A%20%20p%20-%3E%20m_next%20%3D%20tmp%20-%3E%20m_next%3B%0A%20%20delete%20tmp%3B%0A%20%20m_size--%3B%0A%7D&cumulative=false&curInstr=19&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation

## Find
[[examples/linkedlist-find]]
<!-- #include [[examples/linkedlist-find]] -->
```c++
template <typename T>
ListNode<T>* find( const T& value )
{
  ListNode<T> *runner = head;
  while( runner -> next != nullptr )
  {
    if (value == runner -> data )
      return runner;
    runner = runner -> next;
  }
  return nullptr;
}
```
<!-- /include -->

