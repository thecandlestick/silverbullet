

Date: 2023-10-18


Reminders:
* [ ]  [[PA03]] due friday

Objectives:
* [ ] finish Queues

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

