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

* [ ] direct-proofs  📅2024-02-12 #cs1200task

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

Therefore, by definition, **m+n** is even.

---

# Common Proof Mistakes

There are often many ways to prove a given statement, but there are also several ways to write an _invalid_ proof. Here, will go over some common pitfalls to watch out for

**Giving a specific example for a universal statement**

_example:_

**STATEMENT:** The sum of any two odd integers is even

**(invalid) PROOF:**
Let **m = 15** and **n = 5**
Then **m + n = 20** is even as it can be expressed as **2(10)** where **10** is an integer

Therefore, the sum of any two odd integers is even

---
**Using the same variable to represent different things**

_example:_

**STATEMENT:** The sum of any two odd integers is even

**(invalid) PROOF:**

Suppose m and n are any odd integers.
Then by definition, **m = 2k + 1** and **n = 2k + 1**
Where k is an integer.

Substituting yields:
**m + n = (2k+1) + (2k+1) = 4k + 2 = 2(2k+1)**
Where **2k+1** is an integer

Therefore, by definition, **m + n** is even

---
**Jumping to a conclusion**

_example:_

**STATEMENT:** The sum of any two odd integers is even

**(invalid) PROOF:** 

Suppose **m** and **n** are any odd integers.
Then **m = 2r + 1** and **n = 2s + 1**
Where **r** and **s** are integers

Substituting yields:
**m + n = (2r + 1) + (2s + 1)**

Therefore, **m + n** is even

---
**Assuming the truth of the conclusion**
_also known as Circular Reasoning_

_example:_

**STATEMENT:** The sum of any two odd integers is even

**(invalid) PROOF:**

Suppose **m** and **n** are any odd integers.
When adding two odd numbers, the result is always even.

Therefore, **m + n** is even

---
# Indirect Proofs

#Definition An **indirect proof** attempts to prove a statement which is either _logically equivalent_ to the statement being proved or leads logically to the statement being proved by rules of inference

These methods are valuable when the _direct proof_ of a statement is particularly difficult or cumbersome

## Proof by Contradiction

A _proof by contradiction_ is structured as follows:

1. **Suppose the statement to be proven is _false_**
  2. Formally state the negation, which is assumed _true_
3. **Show that this supposition leads to a _logical contradiction_**
4. **Conclude that the original statement is true by the _contradiction rule_**

---
**STATEMENT:** There is no greatest integer

**PROOF:**
Suppose there is a greatest integer, then
```latex
\exists x \in \Z \text{ such that } \forall y \in \Z, x \geq y \text{ (hypothesis)}
```

Let x be any such integer.
Since integers are closed under addition and 1 is an integer,
**z = x + 1** is an integer and **x < z**

Thus, x is the greatest integer (by hypothesis) and not the greatest integer (by counterexample), a contradiction

Therefore, the hypothesis is false and there is no greatest integer

---
**STATEMENT:** There is no integer that is both even and odd

**PROOF:**
Suppose there exists an integer that is both even and odd,
```latex
\exists n \in \Z, \exists d,k \in \Z \text{ such that } (n=2d) \land (n=2k+1)
```

Substituting yields:
```latex
2d = 2k+1\\
2d-2k = 1\\
d-k = \frac{1}{2}
```

By the closure of integers under subtraction, **d-k** is an integer.
1/2 is not an integer, however, a contradiction.

Therefore, The hypothesis is false and there is no integer that is both even and odd

---
**STATEMENT:** The sum of any rational number and any irrational number is irrational

**PROOF:**
Suppose there is a rational number **r** and an irrational number **s** such that **r + s** is rational
```latex
\exists r \in \mathbb{Q}, s \notin \mathbb{Q} \text{ such that } r+s \in \mathbb{Q} 
```

Then by definition of rational,
```latex
\exists a,b \in \Z \text{ such that } r = \frac{a}{b}\\
\exists c,d \in \Z \text{ such that } r+s = \frac{c}{d}\\
```

Substituting yields:
```latex
\frac{a}{b} + s = \frac{c}{d}\\
s = \frac{c}{d} - \frac{a}{b} = \frac{bc-ad}{bd}
```

Since integers are closed under multiplication and subtraction, **bc-ad** and **bd** are integers. Thus **s** is rational by definition, contradicting the supposition that **s** is irrational

Therefore, the hypothesis is false and the sum of any rational number and any irrational number is irrational
