#cs1575LN
|  |  |  |  |
|----------|----------|----------|----------|
| [[CS1575|Home]] | [[CS1575 Calendar|Calendar]] | [[CS1575 Syllabus|Syllabus]] | [[Lecture Notes]] |


## Reminders

```query
cs1575task
where done = false
render [[template/task]]
```

## Objectives

```query
task
where page = "CS1575 Calendar" and done = false
limit 3
order by pos
render [[template/topic]]
```
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
  bar(); // (2)
}

int main()
{
  int x = 1;
  foo(); // (1)
  foo(); // (3)
  bar(); // (4)

  return 0;
}
```

Each function (main, foo, bar) has its own scope and local variable that should only be accessible from inside that function. Execution will need to jump between these scopes several times, how might you use a stack to manage this?

Every time a function call is made, a **stack frame** is created to preserve the current state of the program. This stack frame is pushed to the top of the call stack, containing information such as local variables as a return address to where code execution should resume. 

Every time a function returns, the top of the call stack is popped. The return address is followed to where execution left off, and local variables are restored.

Try tracing the program above using a call stack:
CS = [  ]

## Stack Data Structures

[[ArrayStack]]
[[LinkedStack]]



---

# Queues

## The Abstract Data Type Queue

A queue is a _sequence_ of elements of the same type

One end of the sequence is designated as the _front_, the other is the _back_. A queue follows a _first-in, first-out_ (FIFO) strategy where the data that has been in the sequence the longest is always the first to be removed.

### Operations:

_Let Q1 = **front** -> < a, o, e, u, i >_ <- **back**
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

## Queue Data Structures

[[ArrayQueue]]
[[LinkedQueue]]

Consider the following queue:

  _front_ -> **< a0, a1, a2, ... , an >** <- _back_

Can [[ArrayList]] operations efficiently implement _front, enqueue, dequeue?_ 

![ArrayList diagram](img/arrlist-diagram.png)

How might we re-engineer the ArrayQueue to make all 3 operations into constant-time algorithms?

  _front / head_ -> **< a0, a1, a2, ... , an >** <- _back / tail_ 

Offers quick enqueue operations, but dequeue requires shifting elements... _or does it..._ enter the _circular array_

[[examples/arrayqueue-class]]
<!-- #include [[examples/arrayqueue-class]] -->
```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayQueue
{
  private:
    int m_front;      // index-of start of valid data
    int m_back;       // index-of next available space   
    int m_capacity;   // length of storage array
    int m_size;       // # of valid data elements
    T *m_data;        // pointer to storage array
    void resize(int new_capacity);
  public:
    ArrayList() : m_front (0), m_back (0), m_capacity (MIN_CAPACITY) 
                { m_data = new T[m_capacity]; } // default constructor

    //OPERATIONS
    T& top();
    void enqueue(const T& value);
    void dequeue();
};
```
<!-- /include -->


[Visualization](https://www.cs.usfca.edu/~galles/visualization/QueueArray.html)


[[examples/arrayqueue-ops]]

