#cs1200LN
|  |  |  |  |
|----------|----------|----------|----------|
| [[CS1200|Home]] | [[CS1200 Calendar|Calendar]] | [[CS1200 Syllabus]] | [[Lecture Notes]] |


## Reminders

```query
cs1200task
where done = false
order by pos
limit 4
render [[template/topic]]
```

## Objectives

```query
task
where page = "CS1200 Calendar" and done = false
limit 3
order by pos
render [[template/topic]]
```
---


---

**Practice Problems:**

* How many 3-digit integers (100-999) are divisible by 5?
* How many integers from 1 through 999 have no repeated digits?
* How many integers from 1 through 999 have at least one repeated digit?
* What is the probability that a randomly chosen integer 1-999 contains at least one repeated digit?
* How many 4-digit integers have exactly 3 repeated digits?
* How many 4-digit integers have at least 3 repeated digits?

---
# Counting Unions & Intersections of Sets

Getting the exact number of elements in a union of sets can be tricky. After all, the sets might in general share some elements or they might not

#Theorem For finite sets **A and B**:
```latex
|A \cup B| = |A| + |B| - |A \cap B|
```

Intuitively, this means that the number of elements in **A U B** is equal to the number of elements in **A** plus the number of elements in **B** minus the number of elements that they share.

#DiscussionQuestion Using the theorem above, how many integers from 1 to 1000 are multiples of 3 or 5?

#DiscussionQuestion Given the following information:
  * How many students are currently enrolled in CS 1570? **20**
  * How many students are currently enrolled in MATH 1215? **7**
  * How many students are enrolled in _either_ course? **22**
Use the theorem above to calculate the number of students enrolled in _both_ courses

---
## The Pigeonhole Principle

The _Pigeonhole Principle_ states that if **n** pigeons fly into **m** pigeonholes to roost, where **n > m**, then at least one pigeonhole contains more than one pigeon

![](../img/TooManyPigeons.jpg)

This is fairly intuitive, but nonetheless serves as an important foundation for many higher level mathematical results

#Theorem (_The Pigeonhole Principle_) A function from set **A** to set **B**, **f: A -> B**, where **|A| > |B|**, can never be _one-to-one / injective_ 

_examples:_

* What size group of people is needed to _guarantee_ at least two people share a birth month?
  
* In a drawer containing 5 red socks and 5 black socks, how many socks must be drawn to _guarantee_ a matching pair? How many to guarantee a pair of black socks?
  
* If 5 integers are selected from **{1,2,3,4,5,6,7,8}**, is it _guaranteed_ that at least one pair will have a sum of **9**?

#Theorem (_Generalized Pigeonhole Principle_) Given any function **f** from a finite set **X** with **n** elements to a finite set **Y** with **m** elements,
```latex
\forall k \in \Z^+, \text{If }k < \frac{n}{m} \text{ then }\exists y \in Y\\ \text{ such that }y\text{ is the image of at least k+1 distinct elements of }X
```

The _contrapositive_ form of this theorem is then
```latex
\forall k \in Z^+, \text{ If } y \text{ is the image of at most }k \text{ distinct elements of X, then } n < km
```

