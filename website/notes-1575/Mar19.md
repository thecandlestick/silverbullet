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

* [ ] pa03  📅2024-03-21 #cs1575task


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


Consider the following queue:

  _front_ -> **< a0, a1, a2, ... , an >** <- back

Can [[LinkedList]] operations efficiently implement _front, enqueue, dequeue?_ 

How might we re-engineer the LinkedQueue to make all 3 operations into constant-time algorithms?

[[examples/linkedqueue-class]]

[[examples/linkedqueue-ops]]

# What is Recursion

Click here for an explanation: [[Recursion]]


Just kidding. Recursion is a means of mathematical definition in which one or more components or properties of an object are defined in terms of the object itself.

For example, suppose you’ve been tasked with formally defining the set of natural numbers to a room of very uptight mathematicians. 
You might give the answer:
  _1, 2, 3, 4, ..._
But this isn’t good enough for the mathematicians, you just gave some examples not a formal description!

You might try again with something like:
  _A natural number is a positive number without decimals_
While this is true of all natural numbers, the crowd still won’t be satisfied unless you define the words _positive_ and _decimal_! 🤓

You finally decide to use a **recursive definition**:
  * 1 is a natural number
  * _n_ is a natural number if and only if _n-1_ is a natural number
And the mathematicians nod in approval

_Recursion_ is a means of defining something in terms of itself.

Every recursive definition will have two components:
* One or more **Base Cases** - statements that give a direct answer/result
* One or more **Recursive Cases** - statements that give an indirect answer in terms of the object in question

---
# Recursion as a Problem-Solving Tool

So why do we care? Well as computer scientists, our particular flavor of “problem-solving” revolves around simply giving a very careful and precise definition of the problem at hand. It may be unsurprising, therefore, that recursion is not only deeply ingrained into the theory of computer science, it is also a powerful tool to apply towards high-level problems.

In a recursive algorithm, we take the _global_ problem to be solved and formulate it in terms of smaller _sub-problems_ that are easier to solve but still have the same structure as the global. It relates to the classic problem-solving strategy of _Divide-and-Conquer_. 

A _recursive algorithm_ consists of the following components:
* **Base Case** - an instance of the problem that can be solved directly
* **Recursive Case** - a _Decomposition_ of the problem into smaller instances, along with a complete solution _Composed_ from the smaller solutions

Here, _smaller_ means that it must make some amount of progress toward a directly solvable _Base Case_

Let’s write a recursive algorithm for computing exponents
- What is our _Base Case(s)?_
- What is our _Recursive Case(s)?_
  
[[examples/recursion-exponentiation]]

