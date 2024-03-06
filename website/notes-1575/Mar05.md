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

# 
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

```latex
\text{Given functions f(x) and g(x),}\\
\text{we say that f(x) is O(g(x)) if and only if there exist positive constants C and }n_0\\
\text{such that for every }n > n_0, f(n) \leq C*g(n)
```

Human-readable format:

```latex
\text{"f(x) is O(g(x))" means that the rate-of-growth of g(x) is}\\ \text{greater than or equal to the rate of growth of f(x),}\\ \text{when ignoring constant factors}
```

The key to proving these properties is to remember that you can choose any positive constants that make the inequality true for a sufficiently large n value.

The key to disproving these properties is to let C represent some arbitrarily high number, and then show that the inequality always becomes false for a sufficiently large n value.

[[examples/big-oh-basics]]

**Definition: (Big-theta Notation)**

```latex
\text{Given functions f(x) and g(x),}\\
\text{we say that f(x) is Θ(g(x)) if and only if there exist positive constants}\\
C_1, C_2, n_0\text{ such that for every }n > n_0, C_1*g(n) \leq f(n) \leq C_2*g(n)
```

Equivalently:

```latex
\text{If f(x) is O(g(x)) and g(x) is O(f(x)),}\\
\Rightarrow \text{f(x) is Θ(g(x)) and g(x) is Θ(f(x))}
```

Human-readable format:

```latex
\text{"f(x) is Θ(g(x))" means that the rate-of-growth of g(x) is}\\
\text{equal to the rate of growth of f(x),}\\
\text{when ignoring constant factors}
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

From the formal definition of Big-O and Big-theta, we can prove some useful theorems that we can use to map a large, unruly function into its place in the complexity hierarchy. 

If T1(n) is O(f(n)) and T2(n) is O(g(n)), then:
* T1(n) + T2(n) is O( max(f(n), g(n)) )
* T1(n) * T2(n) is O( f(n)*g(n) )

And from those theorems:
* A polynomial of degree k is O( n^k )

**Note: The theorems above also work for big-Θ**
