

Date: 2023-06-29
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=a8ebb6f0-2f0e-4142-bb6b-b030013798b3

Reminders:
* [x] check pa02 score on canvas

Objectives:
* [x] Stacks & Queues

---

In this section we’ll see how some limited, minimal data structures can still be a powerful tool. We’ll also see how having fewer operations can lead to enhanced performance through clever engineering

# Stacks

## The Abstract Data Type Stack

A stack is a _sequence_ of elements of the same type

* [x] sarah
* [x] tony
* [x] dheeraj

One end of the sequence is designated the _top_. A stack follows a strategy of _first-in, last-out_ (FILO) where the newest data in the sequence is always the first to be removed.

### Operations:

_Let S1 = < a, o, e, u, i >_
* top(S) -> the top element of S
  * top(S1) -> a
    
* push(S, x) -> S’ with new top element, x
  * push(S1, y) -> < y, a, o, e, u, i >
    
* pop(S) -> S’ with top element removed
  * pop(S1) -> < o, e, u, i >

* [x] garret h
* [x] makalyn
* [x] sarah
* [x] ben

## Applications for Stacks

**The Matching Brackets Problem**

Consider the problem of parsing a written program and determining if a given line is a valid expression or not. If your language supports nested expressions with brackets () [] {}, then you may need to verify that these brackets are used appropriately.

An expression is invalid if:
* an opening bracket ( [ { does not have a matching closing bracket
* a closing bracket ) ] } does not have a matching opening bracket
* the string in-between a pair of matching brackets is an invalid expression

* [x] sarah
* [x] tony
* [x] dheeraj

 { [] }

How might you use a stack to efficiently validate an expression?

* read in string char-by-char _c_
* if c is an opening bracket
  * push c to stack
* if c is a closing bracket
  * compare to top of stack
  * if they match
    * pop top of stack
  * if they dont
    * INVALID
* check if stack is empty
  * INVALID if not empty

Test your solution on the following expressions:
* ```a(b)[cd]``` valid
* ```(b[)ef]``` invalid
* ```({x}``` invalid
* ```([a{b]c)}``` invalid

  ```[  ]``` top

**The Call Stack**

C++ actually uses a stack for a very important purpose, and if you’re familiar with using a debugger you’ve probably viewed it yourself. The call stack allows your program to efficiently change scope when calling a function and resume execution where it left off after the function returns.

Consider the following program:
```c++
void bar()
{
  int z = 3;
  // ...
}

void foo()
{
  int y = 2;
  bar(); // (B)
}

int main()
{
  int x = 1;
  foo(); // (A)
  foo(); // (C)
  bar(); // (D)

  return 0;
}
```

Try tracing the program above using a call stack:
CS = ```[ ]```

Each function (main, foo, bar) has its own scope and local variable that should only be accessible from inside that function. Execution will need to jump between these scopes several times, how might you use a stack to manage this?

Every time a function call is made, a **stack frame** is created to preserve the current state of the program. This stack frame is pushed to the top of the call stack, containing information such as local variables as a return address to where code execution should resume. 

Every time a function returns, the top of the call stack is popped. The return address is followed to where execution left off, and local variables are restored.


## Stack Data Structures

[[ArrayStack]]
[[LinkedStack]]

```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayStack
{
  private:
    int m_size;       // # of elements currently stored
    int m_capacity;   // length of storage array
    T *m_data;        // pointer to storage array
    void resize(int new_capacity);
  public:
    ArrayStack() : m_size (0), m_capacity (MIN_CAPACITY) 
                { m_data = new T[m_capacity]; } // default constructor

    //OPERATIONS
    T& top();
    void push(const T& x);
    void pop();
};
```

Consider the following stack:

  _top_ -> **< a0, a1, a2, ... , an >**

Can [[ArrayList]] operations efficiently implement _top_, _push_, and _pop_?

YES we can if we define head -> **< a0, a1, a2, ... , an >** <- tail / top

![class diagram](arraylist-diagram.png)
* [x] sarah
* [x] dheeraj

```c++
template <typename T>
class StackNode
{
  public:
    T m_data;  // single data item
    StackNode<T> *m_next;  // ptr to next node
}

template <typename T>
class LinkedStack
{
  private:
    StackNode<T> *m_head;  // ptr to first node
    int m_size;
  public:
    //OPERATIONS
    T& top();
    void push(const T& x);
    void pop();
};
```

Consider the following stack:

  _top_ -> **< a0, a1, a2, ... , an >**

Can [[LinkedList]] operations efficiently implement _top_, _push_, and _pop_?
YES we can if we define head / top -> **< a0, a1, a2, ... , an >** <- tail
![linked list](img/linklist-diagram.png)
