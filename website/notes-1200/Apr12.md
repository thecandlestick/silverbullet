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


_example:_ **Sharing Computers**

**42** students are sharing **12** computers.  Prove that there is a computer being used by **3** or more students

_consider the students as pigeons and the computers as pigeonholes_

**S** - The set of students
**C** - The set of computers

**f : S -> C** is a function mapping each student to the computer they are using

**S** has **n = 42** elements and **C** has **m = 12** elements, so the _generalized pigeonhole principle_ applies to **f**

Let **k = 2**, then the proposition:
```latex
\exists y \in C \text{ such that }y \text{ is the image of at least k+1 distinct elements of S}
```
means that there exists a computer “**c**“ and students “**s1, s2, s3”** such that
* **f(s1) = c**
* **f(s2) = c**
* **f(s3) = c**

In other words, there is a computer being shared by **3** students.

The _generalized pigeonhole principle_ states that this is true if:
```latex
k < \frac{n}{m} \leftrightarrow 2 < \frac{42}{12} = 3.75\\
```

Therefore, a computer is being used by at least 3 students

---
_example:_ **shared initials**

Out of a group of **85** people, is it always the case that at least **4** people share a first initial?

Let’s consider a proof by contradiction:

Suppose not, that no **4** people out of **85** have the same first initial. Then at most **3** people can share any particular letter as their initial

If we consider the following function:

**P** - set of people (**n = 85**)
**I** - set of initials (**m = 26**)
**f: P -> I** maps a person to their first initial

Then the _contrapositive_ form of the _generalized pigeonhole principle_ (where _y_ is the image of at most _k = 3_ elements of **P**) tells us that **n** (the number of elements in **P**) must be less than **km = 3x26 = 78**.

This is a contradiction, as we originally stated there were **85** people in **P** which is not less than **78**

Therefore, our supposition was false. That is, at least **4** people in **85** share a first initial.

---

#Theorem For finite sets **A,B,C**:
```latex
|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |B \cap C| - |A \cap C| + |A \cap B \cap C| 
```

#DiscussionQuestion How can we interpret the theorem above? Try using a Venn diagram to visualize the result and gain a better intuition 

_example:_ **Drug study**

A pharmaceutical company is performing a trial of three new medications, **Drug A, Drug B**, and **Drug C** 

**50** patients were given the medications to try and asked to report on if they experienced relief of their symptoms. The results were as follows:

* **21** patients reported relief when using **Drug A**
* **21** patients reported relief when using **Drug B**
* **31** patients reported relief when using **Drug C**
* **9** patients reported relief when using **Drugs A & B**
* **14** patients reported relief when using **Drugs A & C**
* **15** patients reported relief when using **Drugs B & C**
* **41** patients reported relief from at least one of the drugs

Analyze the results of the trial by drawing a Venn diagram representing the results and answering the following questions:
* How many patients got relief from none of the drugs? **9**
* How many patients got relief from all 3 of the drugs? **6**
* How many patients got relief from **Drug A** _only_? **4**

---
# Combinations

Recall the definition of _r-permutations_. A similar concept is given for problems in which order is not considered

#Definition An **r-combination** of a set with **n** elements is an (unordered) subset of the set with **r** elements. The number of _r-combinations_ of a set of **n** elements is denoted **C(n,r)** and read as **“n choose r”**

#Theorem If **n** and **r** are integers such that **1 <= r <= n**, then **C(n,r)** is given by the formula:
```latex
C(n,r) = \frac{\text{\# of r-permutations}}{\text{\# of ways to order r elements}} = \frac{\frac{n!}{(n-r)!}}{r!} = \frac{n!}{r!(n-r)!}
```

_Note: C(n,r) is also denoted_
```latex
C(n,r) = {n \choose r}
```

Another convenient interpretation of **C(n,r)** is that it is the number of unique r-element _subsets_ of a set with **n** elements

_example:_

Suppose that 12 children are playing four-square during recess (a game that requires exactly 4 players). How many different games could be played (with a unique selection of players)?

If there are no further restrictions, number of unique games is given by 
```latex
{12 \choose 4} = \frac{12!}{4!(12-4)!} = 495
```

#DiscussionQuestion How would this change if two of the twelve students insisted on playing together (they either both play or neither plays)? How many games could be formed then?

#DiscussionQuestion What if instead two students refused to play together (but would still play with other students or not at all)? How could we count the number of possible games?
