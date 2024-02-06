#cs1200LN
|  |  |  |  |
|----------|----------|----------|----------|
| [[CS1200|Home]] | [[CS1200-Calendar|Calendar]] | [[course syllabus|Syllabus]] | [[course lec notes|Lecture Notes]] |


## Reminders

```query
cs1200task
where done = false
order by pos
limit 4
render [[template/task]]
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


#Definition A real number **r** is **rational** if and only if it can be expressed as a quotient of two integers with a nonzero denominator.

```latex
\text{r is rational} \Leftrightarrow \exists a, b \in \Z \text{ such that } r = \frac{a}{b} \land b \ne 0
```

#DiscussionQuestion Are the following numbers _rational_?
* 10/3
* 3/10
* 0.1212121212...
* x, where x is an integer
* 320.5492492492492492...

**Zero Product Property:** If neither of two real numbers is zero, their product is also not zero

_how to formalize?_
```latex
\forall x, y \in \R, x \ne 0 \land y \ne 0 \rightarrow xy \ne 0
```


**Closure of Rationals under Addition:** The sum of _any_ two rational numbers is also rational

#DiscussionQuestion How would you approach a proof to the property above?

#Definition If **n** and **d** are integers and **d != 0**, 
**n** is **divisible** by **d** if and only if **n** equals **d** times some integer
```latex
d | n \Leftrightarrow \exists k \in \Z \text{ such that } n = dk
```

_equivalent statements:_
```latex
\text{n is divisible by d}\\
\Leftrightarrow \text{n is a multiple of d}\\
\Leftrightarrow \text{d is a factor of n}\\
\Leftrightarrow \text{d is a divisor of n}\\
\Leftrightarrow \text{d divides n}\\
\Leftrightarrow d | n \text{ where } d \in \Z/\{0\}
```

#BoardQuestion Can we use this definition to prove that _divisibility_ is _transitive_?

#KnowledgeCheck True or False: _3 divides (3k+1)(3k+2)(3k+3)_

#Definition An integer **n** is **prime** if and only if **n > 1** and for all positive integers **r** and **s**, **n = rs** implies **r** or **s** equals **n**
```latex
\text{n is prime}\\
\Leftrightarrow (n > 1) \land \forall r,s \in \Z^+, n=rs \rightarrow (r = n \lor s = n)
```

#Definition An integer is **composite** if and only if **n > 1** and **n = rs** for some integers **r** and **s** where **1 < r < n** and **1 < s < n**
```latex
\text{m is composite}\\
\Leftrightarrow (m > 1) \land \exists r,s \in \Z^+ \text{ such that } m = rs\\
\text{where }(1 < r < m) \land (1 < s < m)
```

## Constructive Proofs

#Definition A **constructive proof of existence** provides a concrete example or method of constructing an instance satisfying an _existential statement_ 

_example:_
* “There exists an integer n that can be written as both the sum of and the difference of two prime numbers”
* **Give concrete example:** 5
* **Show that it satisfies the statement:** 2+3 , 7-2

A similar strategy can be taken when seeking to _disprove_ a _universal statement_. 

If your goal is to prove that a statement is _false_
```latex
\forall x \in D, P(x) \rightarrow Q(x)
```
It is equivalent to prove that the _negation_ is _true_
```latex
\exists y \in D \text{ such that } P(y) \land \sim Q(y)
```

In this case, you can provide a _constructive proof_ demonstrating a concrete example for **y** (a _counterexample_)

---
# Direct Proofs

#Definition A **Direct Proof** begins with a _generic particular_ and arrives at the statement to be proved using only logical principles

The process of writing a _direct proof_ is as follows:

1. **Express the statement to be proved**
```latex
\forall x \in D, P(x) \rightarrow Q(x)
```
2. **Suppose the generic instance**
```latex
\text{Suppose } x \in D \text{ and } P(x)
```
3. **Show that the conclusion must be true by means of given definitions, established facts/ground truth, and logical inference**

_example:_
(_Epp p.154, Thm 4.1.1_)

---
**STATEMENT:** The sum of any two even integers is even
```latex
E(x) := \exists k \in \Z \text{ such that } x = 2k\\
\forall m, n \in \Z^, E(m) \land E(n) \rightarrow E(m+n)
```

**PROOF:** 

Suppose **m** and **n** are even integers.
By definition, **m = 2r** and **n = 2s** for some integers **r** and **s**.
Substituting yields:
```latex
m + n = 2r + 2s = 2(r + s)
```

Let **t = r + s**. 
Substituting yields:
```latex
m + n = 2(t)
```
Where **t** is an integer by closure of ℤ under addition.

Therefore, by definition (of even numbers), **m+n** is even.

---