

Date: 2023-10-20


Reminders:
* [ ]  [[PA03]] due tonight

Objectives:
* [ ] finish queues

---


Consider the following queue:

  _front_ -> **< a0, a1, a2, ... , an >** <- back

Can [[LinkedList]] operations efficiently implement _front, enqueue, dequeue?_ 

How might we re-engineer the LinkedQueue to make all 3 operations into constant-time algorithms?

![linked list](img/LL-diagram.png)

[[examples/linkedqueue-class]]
<!-- #include [[examples/linkedqueue-class]] -->
```c++
template <typename T>
class QueueNode
{
  public:
    T m_data;  // single data item
    QueueNode<T> *m_next;  // ptr to next node
}

template <typename T>
class LinkedQueue
{
  private:
    QueueNode<T> *m_sentinel;  // ptr to sentinel node
    int m_size;
  public:
  //OPERATIONS
    T& front();
    void enqueue(const T& value);
    void dequeue();
};
```
<!-- /include -->



[[examples/linkedqueue-ops]]
<!-- #include [[examples/linkedqueue-ops]] -->
```c++
template <typename T>
T& LinkedQueue<T>::front()
{
  return m_sentinel -> m_next -> m_data;
}

template <typename T>
void LinkedQueue<T>::enqueue(const T& value)
{
  QueueNode<T> *new_sentinel = new QueueNode<T>;
  new_sentinel -> m_next = m_sentinel -> m_next;  // point to front

  m_sentinel -> m_data = value;
  m_sentinel -> m_next = new_sentinel; // old sentinel becomes back

  m_sentinel = new_sentinel; // redirect m_sentinel pointer
  m_size++;
}

template <typename T>
void LinkedQueue<T>::dequeue()
{
  QueueNode<T> *tmp = m_sentinel -> m_next; // point to front
  m_sentinel -> m_next = tmp -> m_next; // remove front from chain
  delete tmp;
  m_size--;
}
```
<!-- /include -->

![](img%2Flinkq-diagram.png)

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

Every recursive definition will have two components:
* One or more **Base Cases** - statements that give a direct answer/result
* One or more **Recursive Cases** - statements that give an indirect answer in terms of the object in question

---
# Recursion as a Problem-Solving Tool

So why do we care? Well as computer scientists, our particular flavor of “problem-solving” revolves around simply giving a very careful and precise definition of the problem at hand. It may be unsurprising, therefore, that recursion is not only deeply ingrained into the theory of computer science, it is also a powerful tool to apply towards high-level problems.

In a recursive algorithm, we take the _global_ problem to be solved and formulate it in terms of smaller _sub-problems_ that are easier to solve but still have the same structure as the global. It relates to the classic problem-solving strategy of _Divide-and-Conquer_. 

For this we give very similar definitions to mathematical recursion:
* **Base Case** - an instance of the problem that can be solved directly
* **Recursive Case** - a _Decomposition_ of the problem into smaller instances, along with a complete solution _Composed_ from the smaller solutions

Here, _smaller_ means that it must make some amount of progress toward a directly solvable _Base Case_, otherwise our algorithm would never end!

Let’s write a recursive algorithm for computing exponents
- What is our _Base Case(s)?_
- What is our _Recursive Case(s)?_
  
[[examples/recursion-exponentiation]]

