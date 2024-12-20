---
tags: template
hooks.snippet.slashCommand: stack-queue
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
  bar();
}

int main()
{
  int x = 1;
  foo();
  foo();
  bar();

  return 0;
}
```

Each function (main, foo, bar) has its own scope and local variable that should only be accessible from inside that function. Execution will need to jump between these scopes several times, how might you use a stack to manage this?

---

![](img/call-stack.png)

---
![](img/variable-lifecycle.png)

---


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

_Let Q1 = < a, o, e, u, i >_
* front(Q) -> the front element of Q
  * front(Q1) -> ?
    
* enqueue(Q, x) -> Q’ with new back element, x
  * enqueue(Q1, y) -> ?
    
* dequeue(Q) -> Q’ with front element removed
  * dequeue(Q1) -> ?

## Applications for Queues

* Scheduling problems
* Control of Peripherals
* Simulations
* etc.

## Queue Data Structures

[[ArrayQueue]]
[[LinkedQueue]]