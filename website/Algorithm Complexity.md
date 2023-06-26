
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

Some of these things aren’t so easy to ensure, and empirical testing in general is prone to producing skewed results. **Analytical testing** gives us an often more useful method of ranking the two algorithms with mathematical certainty. To do so, we first need to convert the algorithms into functions representing their performance.

---
## Runtime Functions

A **runtime function** is a function that, given the size of an input, approximates the number of _operations_ an algorithm will take to produce the output.

By operations, we mean any sufficiently small procedure that performs a single logical step in the execution. We make this definition to simply the math and to prevent loss of generality between different compilers, processor architectures, etc.
(_examples: + - / * % [] || && < > = == ..._)

For instance, we may have the following runtime functions for Algo A and Algo B:

  **Ta(n) = 3n^2 + 6** operations where n is the size of the input
  **Tb(n) = 0.05n^3 + 2**

_size of input_ in this context is sometimes a bit of a misnomer. What we really mean by it is anything that affects the number of operations required. This is can refer things such as the amount of data currently contained in a data structure or the number of bits in an integer input, for instance. Another consideration is that _size_ of input is not the only factor affecting runtime, two inputs of the same size can give drastically different results.

It’s for this reason that we typically disregard the _best-case scenario_ for inputs in favor of an _average-case_ or _worst-case_.

[[examples/runtime-basics]]

[[examples/runtime-branching]]

[[examples/runtime-looping]]

[[examples/runtime-logarithm]]

If you want to analyze other characteristics, you just need to come up with an equivalent function representation. For example, a function that maps size of input to bytes of memory needed to produce the output would allow you to analyze memory consumption (or _space complexity_)

---
## Comparing Rate-of-Growth

Now that we have a way of representing algorithms as programs, we need a way of comparing them. As relying on our intuition to decide which is function is _better_ can be misleading.

![](img%2Frt-smallscale.png)
_ENHANCE!_

![](img%2Frt-largescale.png)

What we really value in algorithms is how well they _scale_ for large inputs. This due to a relatively simple law of algorithms: 
  
_For small inputs, the differences between Algo A and Algo B will generally be small as well. For large inputs the differences can be much greater, sometimes exponentially so!_ 

The essential characteristic we need to extract from these functions is their **rate-of-growth**. Luckily, we have a collection of mathematical tools to do just that.

**Definition: (Big-O Notation)**

```
Given functions f(x) and g(x), we say that f(x) is O(g(x)) if and only if there exist positive constants C and n0 such that for every n > n0, f(n) <= C*g(n)
```

Human-readable format:

```
"f(x) is O(g(x))" means that the rate-of-growth of g(x) is greater than or equal to the rate of growth of f(x), ignoring constant factors
```

[[examples/big-oh-basics]]

**Definition: (Big-theta Notation)**

```
Given functions f(x) and g(x), we say that f(x) is Θ(g(x)) if and only if there exist positive constants C1, C2 and n0 such that for every n > n0, C1*g(n) <= f(n) <= C*g(n)
```

Equivalently:

```
If f(x) is O(g(x)) and g(x) is O(f(x)), then f(x) is Θ(g(x)) and g(x) is Θ(f(x))
```

Human-readable format:

```
"f(x) is Θ(g(x))" means that the rate-of-growth of g(x) is equal to the rate of growth of f(x), ignoring constant factors
```

---
## The Complexity Hierarchy

The concept of Big-Θ notation is particularly important because it allows us to further simply our analysis. If we can prove that f(x) is Θ(g(x)), then f(x) is equivalent in performance to any other function that is also Θ(g(x)).

This allows us to classify functions by their simple-and-easy-to-work-with equivalents, giving rise to the _Complexity Hierarchy_

| Complexity | Name |
|----------|----------|
| n! | factorial |
| 2^n | exponential |
| ... | ... |
| n^a | polynomial |
| n^3 | cubic |
| n^2 | quadratic |
| n*log(n) | linearithmic |
| n | linear |
| log(n) | logarithmic |
| 1 | constant |

Every runtime function is Θ to only one layer of the hierarchy, and each layer represents dramatically better performance than those that come above it. 

---
## Complexity & Data Structures