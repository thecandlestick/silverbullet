

Date: 2023-10-16


Reminders:
* [ ]  [[PA03]] due Friday

Objectives:
* [ ] continue [[Stacks & Queues]]

---

In this section we’ll see how some limited, minimal data structures can still be a powerful tool. We’ll also see how having fewer operations can lead to enhanced performance through clever engineering

# Stacks

## The Abstract Data Type Stack

A stack is a _sequence_ of elements of the same type

One end of the sequence is designated the _top_. A stack follows a strategy of _first-in, last-out_ (FILO) where the newest data in the sequence is always the first to be removed.

### Operations:

_Let S1 = < a, o, e, u, i >_
* top(S) -> the top element of S
  * top(S1) -> ?
    
* push(S, x) -> S’ with new top element, x
  * push(S1, y) -> ?
    
* pop(S) -> S’ with top element removed
  * pop(S1) -> ? 

## Applications for Stacks

**The Matching Brackets Problem**

Consider the problem of parsing a written program and determining if a given line is a valid expression or not. If your language supports nested expressions with brackets () [] {}, then you may need to verify that these brackets are used appropriately.

An expression is invalid if:
* an opening bracket ( [ { does not have a matching closing bracket
* a closing bracket ) ] } does not have a matching opening bracket
* the string in-between a pair of matching brackets is an invalid expression

How might you use a stack to efficiently validate an expression?

Test your solution on the following expressions:
* ```a(b)[cd]```
* ```(b[)ef]```
* ```({x}```
* ```([a{b]c)}```

```<  >```

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
  bar(); \\ (B)
 // ...
}

int main()
{
  int x = 1;
  foo(); \\ (A)
  foo();
  bar();

  return 0;
}
```

[ ]

Each function (main, foo, bar) has its own scope and local variable that should only be accessible from inside that function. Execution will need to jump between these scopes several times, how might you use a stack to manage this?

Every time a function call is made, a **stack frame** is created to preserve the current state of the program. This stack frame is pushed to the top of the call stack, containing information such as local variables as a return address to where code execution should resume. 

Every time a function returns, the top of the call stack is popped. The return address is followed to where execution left off, and local variables are restored.

Try tracing the program above using a call stack:
CS = [  ]

## Stack Data Structures

[[ArrayStack]]
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

![ArrayList diagram](img/arrlist-diagram.png)

Consider the following stack:

  _top_ -> **< a0, a1, a2, ... , an >**

Can [[ArrayList]] operations efficiently implement _top_, _push_, and _pop_?

_let tail be top_

* Top
  * [num_elements-1]
* Push
  * Push_back()
* Pop
  * Pop_back()
  
[[LinkedStack]]

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

_let head be top_

![linked list](img/LL-diagram.png)

---

# Queues

## The Abstract Data Type Queue

A queue is a _sequence_ of elements of the same type

One end of the sequence is designated as the _front_, the other is the _back_. A queue follows a _first-in, first-out_ (FIFO) strategy where the data that has been in the sequence the longest is always the first to be removed.

### Operations:

_Let Q1 =  front < a, o, e, u, i > back_
* front(Q) -> the front element of Q
  * front(Q1) -> a
    
* enqueue(Q, x) -> Q’ with new back element, x
  * enqueue(Q1, y) -> < a, o, e, u, i, y >
    
* dequeue(Q) -> Q’ with front element removed
  * dequeue(Q1) -> < o, e, u, i >

## Applications for Queues

* Scheduling problems
* Control of Peripherals
* Simulations
* etc.
