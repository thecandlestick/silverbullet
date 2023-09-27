
# LinkedList Class & Diagram

[[examples/linkedlist-class]]


![](img%2Flinklist-diagram.png)
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
    return nullptr;

  return runner;
}
```

Unlike the ArrayList, the LinkedList lacks the _random access_ property meaning that the memory location of the _i-th_ element cannot be inferred simply from the index i. You must follow the chain of pointers to reach that piece of data.

This leads to a different convention for accessing data inside a LinkedList: the **iterator**.

In terms of a LinkedList, an iterator is essentially a pointer to an individual node, with some operations to allow for common use patterns such as advancing to the next node. By accepting an iterator instead of an index, our LinkedList functions can skip the initial _follow the chain_ step and simply jump straight to the relevant piece of data (which saves _time!_).


## Get / Set

[[examples/linkedlist-get-set]]


## Insert
[[examples/linkedlist-insert]]


Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20void%20insert%28ListNode%20*p,%20const%20int%26%20x%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.insert%28p,%204%29%3B%0A%20%20p%20%3D%20p%20-%3E%20m_next%3B%0A%20%20mylist.insert%28p,%208%29%3B%0A%20%20mylist.insert%28p,%206%29%3B%0A%20%20%0A%20%20return%200%3B%0A%7D%0A%0Avoid%20LinkedList%3A%3Ainsert%28ListNode%20*p,%20const%20int%26%20x%29%0A%7B%0A%20%20ListNode%20*tmp%20%3D%20new%20ListNode%3B%0A%20%20tmp%20-%3E%20m_data%20%3D%20p%20-%3E%20m_data%3B%0A%20%20tmp%20-%3E%20m_next%20%3D%20p%20-%3E%20m_next%3B%0A%20%20p%20-%3E%20m_data%20%3D%20x%3B%0A%20%20p%20-%3E%20m_next%20%3D%20tmp%3B%0A%20%20m_size%2B%2B%3B%0A%7D&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation

## Erase
[[examples/linkedlist-remove]]


Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%20%20%20%20ListNode%28int%20data%29%20%7B%20m_next%20%3D%20nullptr%3B%20m_data%20%3D%20data%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20void%20erase%28%20ListNode%20*p%20%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20//%20SKIP%20TO%20%20step%20~20%20for%20erase%0A%20%20mylist.m_size%20%3D%202%3B%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.m_head%20%3D%20new%20ListNode%285%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20%3D%20new%20ListNode%2810%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20-%3E%20m_next%20%3D%20p%3B%0A%20%20p%20%3D%20mylist.m_head%20-%3E%20m_next%3B%0A%20%20mylist.erase%28p%29%3B%0A%20%20%0A%20%20return%200%3B%0A%7D%0A%0Avoid%20LinkedList%3A%3Aerase%28%20ListNode%20*p%20%29%0A%7B%0A%20%20ListNode%20*tmp%20%3D%20p%20-%3E%20m_next%3B%0A%20%20p%20-%3E%20m_data%20%3D%20tmp%20-%3E%20m_data%3B%0A%20%20p%20-%3E%20m_next%20%3D%20tmp%20-%3E%20m_next%3B%0A%20%20delete%20tmp%3B%0A%20%20m_size--%3B%0A%7D&cumulative=false&curInstr=19&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation

## Find
[[examples/linkedlist-find]]


---

# Default Member Functions

## Destructor
[[examples/linkedlist-destructor]]



Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%20%20%20%20ListNode%28int%20data%29%20%7B%20m_next%20%3D%20nullptr%3B%20m_data%20%3D%20data%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20~LinkedList%28%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20//%20SKIP%20TO%20%20step%20~20%20for%20destructor%0A%20%20mylist.m_size%20%3D%202%3B%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.m_head%20%3D%20new%20ListNode%285%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20%3D%20new%20ListNode%2810%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20-%3E%20m_next%20%3D%20p%3B%0A%0A%20%20return%200%3B%0A%7D%0A%0ALinkedList%3A%3A~LinkedList%28%29%0A%7B%0A%20%20ListNode%20*tmp%3B%0A%20%20tmp%20%3D%20m_head%20-%3E%20m_next%3B%0A%20%20while%20%28%20tmp%20!%3D%20nullptr%20%29%0A%20%20%7B%0A%20%20%20%20delete%20m_head%3B%0A%20%20%20%20m_head%20%3D%20tmp%3B%0A%20%20%20%20tmp%20%3D%20m_head%20-%3E%20m_next%3B%0A%20%20%7D%0A%20%20delete%20m_head%3B%0A%7D&cumulative=false&curInstr=19&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation
(the _tmp_ ptr is not visible, but you can follow its value yourself)

## Operator=
[[examples/linkedlist-assign-op]]


Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%20%20%20%20ListNode%28int%20data%29%20%7B%20m_next%20%3D%20nullptr%3B%20m_data%20%3D%20data%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20void%20insert%28ListNode%20*p,%20const%20int%26%20x%29%3B%0A%20%20%20const%20LinkedList%26%20operator%3D%28%20const%20LinkedList%20%26rhs%20%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20//%20SKIP%20TO%20%20step%20~20%20for%20destructor%0A%20%20mylist.m_size%20%3D%202%3B%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.m_head%20%3D%20new%20ListNode%283%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20%3D%20new%20ListNode%287%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20-%3E%20m_next%20%3D%20p%3B%0A%0A%20%20LinkedList%20myotherlist%3B%0A%20%20myotherlist%20%3D%20mylist%3B%0A%0A%20%20return%200%3B%0A%7D%0A%0Aconst%20LinkedList%26%20LinkedList%3A%3Aoperator%3D%28%20const%20LinkedList%20%26rhs%20%29%0A%7B%0A%20%20//%20clear%28%29%3B%20//start%20by%20emptying%20list%20%28excluded%20from%20viz%29%0A%20%20ListNode*%20p%20%3D%20m_head%3B%0A%20%20ListNode*%20q%20%3D%20rhs.m_head%3B%0A%20%20while%20%28%20q%20-%3E%20m_next%20!%3D%20nullptr%20%29%20//use%20two%20pointers%20to%20deep%20copy%0A%20%20%7B%0A%20%20%20%20insert%28p,%20q%20-%3E%20m_data%29%3B%0A%20%20%20%20p%20%3D%20p%20-%3E%20m_next%3B%0A%20%20%20%20q%20%3D%20q%20-%3E%20m_next%3B%0A%20%20%7D%0A%20%20%0A%20%20return%20*this%3B%0A%7D%0A%0Avoid%20LinkedList%3A%3Ainsert%28ListNode%20*p,%20const%20int%26%20x%29%0A%7B%0A%20%20ListNode%20*tmp%20%3D%20new%20ListNode%3B%0A%20%20tmp%20-%3E%20m_data%20%3D%20p%20-%3E%20m_data%3B%0A%20%20tmp%20-%3E%20m_next%20%3D%20p%20-%3E%20m_next%3B%0A%20%20p%20-%3E%20m_data%20%3D%20x%3B%0A%20%20p%20-%3E%20m_next%20%3D%20tmp%3B%0A%20%20m_size%2B%2B%3B%0A%7D&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation
(you may want to make use of the _move and hide objects_ button)

## Copy Constructor
[[examples/linkedlist-copy-constructor]]

