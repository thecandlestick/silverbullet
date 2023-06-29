

Date: 2023-06-28
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=5ac7fd0a-2560-44c3-8e84-b0300136deea

Reminders:
* [x] PA02 due TONIGHT!

Objectives:
* [x] Finish algo complexity

---


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
<!-- #include [[examples/big-oh-basics]] -->
Claim: **n^2 is O(3n^2 + n)**

**Proof:**

Let C = 1, n0 = 1

* n^2 <= C*(3n^2 + n)   _for n > n0_
* n^2 <= 3n^2 + n      _for n > 1_

_but now..._

Claim: **3n^2 is O(n^2)**

**Proof:**

Let C = 4, n0 = 1

* 3n^2 + n <= C*n^2  _for n > n0_
* 3n^2 + n <= 4n^2   _for n > 1_
* n <= n^2           _for n > 1_
<!-- /include -->

* n^2 is O(3n^2 + n)
* 3n^2 + n is O(n^2)
* rate-of-growth is **equal**

* [ ] garret
* [ ] dheeraj
* [ ] ben

**Definition: (Big-theta Notation)**

```
Given functions f(x) and g(x), we say that f(x) is Θ(g(x)) if and only if there exist positive constants C1, C2 and n0 such that for every n > n0, C1*g(n) <= f(n) <= C2*g(n)
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

* [ ] dheeraj

From the formal definition of Big-O and Big-theta, we can prove some useful theorems that we can use to map a large, unruly function into its place in the complexity hierarchy.

If T1(n) is O(f(n)) and T2(n) is O(g(n)), then:
* T1(n) + T2(n) is O( max(f(n), g(n)) )
* T1(n) * T2(n) is O( f(n)*g(n) )

And from those theorems:
* A polynomial of degree k is O( n^k )

---
## Complexity & Data Structures

For the following comparison, assume that both lists accept a ListIterator to access data with operations:
* prev() - move to previous data element
* next() - move to next data element
* moveTo(i) - move to element i

For get, insert, erase, assume that you have a valid ListIterator
![class diagram](arraylist-diagram.png)![linked list](img/linklist-diagram.png)

| Operation | ArrayList | LinkedList |
|----------|----------|----------|
| get | O(1) | O(1) |
| prev | O(1) | O(n) |
| next | O(1) | O(1) |
| moveTo | O(1) | O(n) |
| insert | O(n) | O(1) |
| erase | O(n) | O(1) |


* [ ] dheeraj
* [ ] garret
* [ ] sarah
* [ ] tony
* [ ] tony
* [ ] doug
* [ ] garret w

What conclusions can you draw about which list to use?

How might implementing LinkedList as a doubly-linked (bidirectional) list change the results?

