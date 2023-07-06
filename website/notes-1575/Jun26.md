

Date: 2023-06-26
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=07516bf7-0b31-403d-a4dc-b02d01388f1f

Reminders:
* [x] PA02 due wednesday
* [x] Quiz 2 due tonight!

Objectives:
* [x] intro to algorithm complexity

---

# Intro to Algorithm Complexity

## Motivation

Consider the following scenario: 
You have access to two algorithms, Algo A and Algo B.

Algo A and Algo B both produce identical outputs from identical inputs, and they are both always correct. How then can we compare these algorithms? Does it matter which one we choose?

What differs between Algo A and Algo B?
* Speed?
* Memory Consumption?
* readability
* re-usability
* scalability
* What else?

We need an objective way to take these characteristics and decide which algorithm is the _better method_ for our purposes.

* [x] sarah
* [x] duc
* [x] doug

---
## Empirical vs. Analytical Testing

Let’s focus on speed (or _time complexity_), but these techniques can be applied to practically anything.

One approach that we could take is **empirical testing**, in terms of speed this could entail literally running the two algorithms and timing how long they take to complete. ⏱️

In order to make this a fair and objective comparison, what factors would you need to hold constant?

* benchmark
* controlled environment

* [x] dheeraj
* [x] garret w
* [x] sarah

Some of these things aren’t so easy to ensure, and empirical testing in general is prone to producing skewed results. **Analytical testing** gives us an often more useful method of ranking the two algorithms with mathematical certainty. To do so, we first need to convert the algorithms into functions representing their performance.

---
## Runtime Functions

A **runtime function** is a function that, given the ==size of an input==, approximates the ==number of _operations_== an algorithm will take to produce the output.

By operations, we mean any sufficiently small procedure that performs a single logical step in the execution. We make this definition to simply the math and to prevent loss of generality between different compilers, processor architectures, etc.
(_examples: + - / * % [] || && < > = == ..._)

For instance, we may have the following runtime functions for Algo A and Algo B:

  **Ta(n) = 3n^2 + 6** operations where n is the size of the input
  **Tb(n) = 0.05n^3 + 2**

* [x] ben w

_size of input_ in this context is sometimes a bit of a misnomer. What we really mean by it is anything that affects the number of operations required. This is can refer things such as the amount of data currently contained in a data structure or the number of bits in an integer input, for instance. Another consideration is that _size_ of input is not the only factor affecting runtime, two inputs of the same size can give drastically different results.

It’s for this reason that we typically disregard the _best-case scenario_ for inputs in favor of an _average-case_ or ==_worst-case_==.

[[examples/runtime-basics]]

```c++
template <typename T>
void ArrayList<T>::swap(int i, int j)
{
  T tmp = data[i]; // 2 / 3?
  data[i] = data[j]; // 3
  data[j] = tmp;  //2
}
```
How many operations? 7
Tswap(n) = 7

* [x] tony


[[examples/runtime-branching]]

```c++
int foo(int n, int k)
{
  int x;
  if (n == 0) // 1 op
    x = 0;  // Block A
  else
  {  // Block B
    x = k*k;
    x = x/n;
  }
  return x;
}
```

How many operations in outer scope? 1
How many in Block A? 1
How many in Block B? 4

Best-Case RTF: T*foo(n) = 1 + 1
==Worst-Case RTF: Tfoo(n) = 1 + 4==


[[examples/runtime-looping]]

```c++
template <typename T>
bool ArrayList<T>::find( const T &x )
{
  //     Init ; Test ; Update
  for(int k=0; k < size; k++)
    if ( data[k] == x ) // Loop Body
      return true; 
  
  return false;
}
```

RTF : Init + Σ(Body + Test + Update) = 1 + size*(2 + 1 + 1)

_let n = size of arraylist_
Tfind(n) = n*4 + 1
