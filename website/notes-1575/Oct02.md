

Date: 2023-10-04


Reminders:
* [ ]  

Objectives:
* [ ] Finish LinkedList

---



# Default Member Functions

## Destructor
[[examples/linkedlist-destructor]]

<!-- #include [[examples/linkedlist-destructor]] -->
```c++
template <typename T>
void LinkedList<T>::clear()  //useful aux. function to have
{
  ListNode<T> *tmp;
  tmp = head -> next;
  while ( tmp != nullptr )
  {
    delete head;
    head = tmp;
    tmp = head -> next;
  }

  size = 0;
}

template <typename T>
LinkedList<T>::~LinkedList()
{
  clear();
  delete head;
}
```
<!-- /include -->


Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%20%20%20%20ListNode%28int%20data%29%20%7B%20m_next%20%3D%20nullptr%3B%20m_data%20%3D%20data%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20~LinkedList%28%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20//%20SKIP%20TO%20%20step%20~20%20for%20destructor%0A%20%20mylist.m_size%20%3D%202%3B%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.m_head%20%3D%20new%20ListNode%285%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20%3D%20new%20ListNode%2810%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20-%3E%20m_next%20%3D%20p%3B%0A%0A%20%20return%200%3B%0A%7D%0A%0ALinkedList%3A%3A~LinkedList%28%29%0A%7B%0A%20%20ListNode%20*tmp%3B%0A%20%20tmp%20%3D%20m_head%20-%3E%20m_next%3B%0A%20%20while%20%28%20tmp%20!%3D%20nullptr%20%29%0A%20%20%7B%0A%20%20%20%20delete%20m_head%3B%0A%20%20%20%20m_head%20%3D%20tmp%3B%0A%20%20%20%20tmp%20%3D%20m_head%20-%3E%20m_next%3B%0A%20%20%7D%0A%20%20delete%20m_head%3B%0A%7D&cumulative=false&curInstr=19&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation
(the _tmp_ ptr is not visible, but you can follow its value yourself)

## Operator=
[[examples/linkedlist-assign-op]]

<!-- #include [[examples/linkedlist-assign-op]] -->
```c++
template <typename T>
const LinkedList<T>& operator=( const LinkedList<T> &rhs )
{
  clear(); //start by emptying list
  ListNode<T>* pos_ptr = head;
  ListNode<T>* data_ptr = rhs.head;
  while ( data_ptr->next != nullptr ) //use two pointers to deep copy
  {
    insert(pos_ptr, data_ptr->data);
    pos_ptr = pos_ptr -> next;
    data_ptr = data_ptr -> next;
  }
}
```
<!-- /include -->


Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%20%20%20%20ListNode%28int%20data%29%20%7B%20m_next%20%3D%20nullptr%3B%20m_data%20%3D%20data%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20void%20insert%28ListNode%20*p,%20const%20int%26%20x%29%3B%0A%20%20%20const%20LinkedList%26%20operator%3D%28%20const%20LinkedList%20%26rhs%20%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20//%20SKIP%20TO%20%20step%20~20%20for%20destructor%0A%20%20mylist.m_size%20%3D%202%3B%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.m_head%20%3D%20new%20ListNode%283%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20%3D%20new%20ListNode%287%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20-%3E%20m_next%20%3D%20p%3B%0A%0A%20%20LinkedList%20myotherlist%3B%0A%20%20myotherlist%20%3D%20mylist%3B%0A%0A%20%20return%200%3B%0A%7D%0A%0Aconst%20LinkedList%26%20LinkedList%3A%3Aoperator%3D%28%20const%20LinkedList%20%26rhs%20%29%0A%7B%0A%20%20//%20clear%28%29%3B%20//start%20by%20emptying%20list%20%28excluded%20from%20viz%29%0A%20%20ListNode*%20p%20%3D%20m_head%3B%0A%20%20ListNode*%20q%20%3D%20rhs.m_head%3B%0A%20%20while%20%28%20q%20-%3E%20m_next%20!%3D%20nullptr%20%29%20//use%20two%20pointers%20to%20deep%20copy%0A%20%20%7B%0A%20%20%20%20insert%28p,%20q%20-%3E%20m_data%29%3B%0A%20%20%20%20p%20%3D%20p%20-%3E%20m_next%3B%0A%20%20%20%20q%20%3D%20q%20-%3E%20m_next%3B%0A%20%20%7D%0A%20%20%0A%20%20return%20*this%3B%0A%7D%0A%0Avoid%20LinkedList%3A%3Ainsert%28ListNode%20*p,%20const%20int%26%20x%29%0A%7B%0A%20%20ListNode%20*tmp%20%3D%20new%20ListNode%3B%0A%20%20tmp%20-%3E%20m_data%20%3D%20p%20-%3E%20m_data%3B%0A%20%20tmp%20-%3E%20m_next%20%3D%20p%20-%3E%20m_next%3B%0A%20%20p%20-%3E%20m_data%20%3D%20x%3B%0A%20%20p%20-%3E%20m_next%20%3D%20tmp%3B%0A%20%20m_size%2B%2B%3B%0A%7D&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation
(you may want to make use of the _move and hide objects_ button)

## Copy Constructor
[[examples/linkedlist-copy-constructor]]

<!-- #include [[examples/linkedlist-copy-constructor]] -->
```c++
LinkedList<T>::LinkedList(const LinkedList<T> &rhs)
{
  head = new ListNode<T>;
  head -> next = nullptr; //create sentinel node

  *this = rhs; //invoke operator=
}
```
<!-- /include -->

