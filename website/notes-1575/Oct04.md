

Date: 2023-10-12


Reminders:
* [ ]  

Objectives:
* [ ] intro to Algo Complexity

---


# Intro to Algorithm Complexity

## Motivation

Consider the following scenario: 
You have access to two algorithms, Algo A and Algo B.

Algo A and Algo B both produce identical outputs from identical inputs, and they are both always correct. How then can we compare these algorithms? Does it matter which one we choose?

What differs between Algo A and Algo B?
* Speed?
* Memory Consumption?
* What else?

We need an objective way to take these characteristics and decide which algorithm is the _better method_ for our purposes.

---
## Empirical vs. Analytical Testing

Let’s focus on speed (or _time complexity_), but these techniques can be applied to practically anything.

One approach that we could take is **empirical testing**, in terms of speed this could entail literally running the two algorithms and timing how long they take to complete. ⏱️

In order to make this a fair and objective comparison, what factors would you need to hold constant?

Some of these things aren’t so easy to ensure, and empirical testing in general is prone to producing biased results. **Analytical testing** gives us an often more useful method of ranking the two algorithms with mathematical certainty. To do so, we first need to convert the algorithms into functions representing their performance.

---
## Runtime Functions

A **runtime function** is a function that, given the size of an input, approximates the number of _operations_ an algorithm will take to produce the output.

By operations, we mean any sufficiently small procedure that performs a single logical step in the execution. We make this definition to simply the math and to prevent loss of generality between different compilers, processor architectures, etc.
(_examples: + - / * % [] || && < > = == ..._)

For instance, we may have the following runtime functions for Algo A and Algo B:

```latex
  T_a(n) = 3n^2 + 6 \\
  T_b(n) = 0.05n^3 + 2
```
Measuring the number of operations where _n_ is the size of the input.

_size of input_ in this context can represent several things. What we really mean by it is anything that affects the number of operations required. This is can refer things such as the amount of data currently contained in a data structure or the number of bits in an integer input, for instance. Another consideration is that _size_ of input is not the only factor affecting runtime, two inputs of the same size can give drastically different results.


It’s for this reason that we typically disregard the _best-case scenario_ for inputs in favor of an _average-case_ or _worst-case_.

[[examples/runtime-basics]]

[[examples/runtime-branching]]
