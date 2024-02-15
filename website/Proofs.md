---
tags: template
trigger: proofs
---

A **proof**, put simply, is a carefully reasoned mathematical argument intended to convince the reader of the truth of an assertion.

_At minimum,_ a correct proof must be logically sound and the conclusion unambiguously true.

_In practice,_ authors of proofs will assume some level of mathematical knowledge on the part of the reader and rely primarily on theorems and rules of inference to make the finished proof more succinct.

_Some knowledge that we will assume:_
* Basic Algebra
* Properties of real numbers
* Equality Properties
  * **A = A** | if **A = B** then **B = A** | if **A = B** and **B = C** then **A = C**
* Associativity, Commutativity, etc.
* Integers closed under +/-/x

## Formalizing Properties

#Definition An integer **n** is **even** if and only if **n** is equal to twice some integer. An integer **m** is **odd** if and only if **m** equals twice some integer plus 1

```latex
\text{n is even} \Leftrightarrow \exists k \in \Z \text{ such that } n = 2k
```
```latex
\text{n is odd} \Leftrightarrow \exists k \in \Z \text{ such that } n = 2k + 1
```

#DiscussionQuestion
* Is 0 even?
* Is 21 odd?
* If a, b are integers, is 10a + 8b + 1 odd?
* If n is an even number, is n/2 even?
* If n is an odd number, is 3n+1 even or odd?

#DiscussionQuestion How would you prove or disprove these statements?
* The sum of an even number and an odd number is odd
* The product of two even numbers is even

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
* **Give concrete example:** ___
* **Show that it satisfies the statement:** ___

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
**m + n = (2k+1) + (2k+1) = 4k + 2 = 2(k+1)**
Where **k+1** is an integer

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

---
## Proof by Contrapositive

A _proof by contrapositive_ is structured as follows:

1. **Construct the statement to be proved as a _conditional statement_**
```latex
P(x) \rightarrow Q(x)
```  
2. **Rewrite the conditional statement in its _contrapositive_ form**
```latex
\sim Q(x) \rightarrow \sim P(x)
```
3. **Prove the _contrapositive_ form**

---
**STATEMENT:** For all integers n, if n^2 is even, then n is even

**PROOF:**
The statement to be proved is
```latex
\forall n \in \Z, EVEN(n^2) \rightarrow EVEN(n) 
```
The (logically equivalent) contrapositive form is
```latex
\forall n \in \Z, ODD(n) \rightarrow ODD(n^2) 
```

Suppose n is any odd integer. By definition,
```latex
\exists k \in \Z \text{ such that } n = 2k+1
```

Substituting yields:
```latex
n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1
```

Since integers are closed under addition and multiplication, **2k^2 +2k**
is an integer. Thus, by definition, n^2 is an odd integer and the contrapositive statement is true.

Therefore, by contrapositive, for all integers n, if n^2 is even, then n is even.

---
**More Properties**

#Theorem **Quotient-Remainder Theorem** - Given any integer **n** and a positive integer **d**, there exist unique integers **q** and **r** such that 
```latex
(n = dq + r) \land (0 \leq r < d)
```

#Definition **n div d** is the _integer_ quotient obtained when _n_ is divided by _d_
```latex
\text{n div d} = \lfloor \frac{n}{d} \rfloor
```

#Definition **n mod d** is the _non-negative integer_ remainder obtained when **n** is divided by **d**
```latex
\text{n mod d} = n - d*(\text{n div d})
```

Combining these concepts, we have that
```latex
\text{n div d} = q \land \text{ n mod d} = r \Leftrightarrow n = dq + r)\land(0 \leq r < d)\\
\text{n div d} = q \Leftrightarrow \exists r \in \Z \text{ such that } (n = dq + r)\land(0 \leq r < d)\\
\text{n mod d} = r \Leftrightarrow \exists q \in \Z \text{ such that } (n = dq + r)
```

_example:_
```latex
\text{n mod 8} = 1 \Leftrightarrow \exists q \in \Z \text{ such that } n = 8q + 1
```

#KnowledgeCheck Suppose **x** is an integer and **x** mod 7 = 4. 
What is **(5x)** mod 7?

_hint: start by applying the example above to get an expression for x_

---
## Proof by Division into Cases

A _proof by division into cases_ is structured as follows:

1. **Divide the domain, D, of the statement to be proved into two or more sub-domains**
  2. You must be able to show that these sub-domains together contain every element of D
3. **Prove the statement for each sub-domain individually**
4. **Conclude the statement must be true for the whole domain, D**

Alternatively, if your statement to be proved is of the form:
```latex
A_1 \lor A_2 \lor ... \lor A_n \rightarrow B
```
Then you can instead prove each of the following individually:
```latex
A_1 \rightarrow B\\
A_2 \rightarrow B\\
...\\
A_n \rightarrow B\\
```
This is equivalent to selecting the sub-domains:
```latex
\{ x \in D | A_1 \}\\
\{ x \in D | A_2 \}\\
...\\
\{ x \in D | A_n \}\\
\{ x \in D | \sim(A_1 \lor A_2 \lor ... \lor A_n) \} \text{ for which the statement is vacuously true }\\
```

---
**STATEMENT:** Any integer **n** can be written in one of the four forms:
```latex
n = 4q \qquad n = 4q + 1 \qquad n = 4q + 2 \qquad n = 4q + 3
```
where q is some integer

**PROOF:**
Let **n** be any integer

By applying the quotient-remainder theorem to **n** with divisor **d=4**, there exist unique integers **q** and **r** such that
```latex
n = 4q + r \text{ and } 0 \leq r < 4
```

The only choices of **r** that could satisfy this are 0,1,2,3.
Thus, by the quotient-remainder theorem, the following statements are all true:
```latex
r = 0 \rightarrow n = 4q\\
r = 1 \rightarrow n = 4q+1\\
r = 2 \rightarrow n = 4q+2\\
r = 3 \rightarrow n = 4q+3 
```

And therefore, the statement is proven for all choices of **n**

_formally, this could be thought of as selecting sub-domains_
```latex
D_1 = \{ n \in \Z | \text{n mod 4} = 0 \}\\
D_2 = \{ n \in \Z | \text{n mod 4} = 1 \}\\
D_3 = \{ n \in \Z | \text{n mod 4} = 2 \}\\
D_4 = \{ n \in \Z | \text{n mod 4} = 3 \}\\
\text{Which were noted to have the property:}\\
D_1 \cup D_2 \cup D_3 \cup D_4 = \Z
```

---
#Definition For any real number **x**, the **absolute value of x**, denoted   |x|, is defined as:
```latex
|x| = 
\begin{cases}
  x & \text{if } x \geq 0\\
  -x & \text{if } x < 0
\end{cases}
```

#Theorem **The Triangle Inequality** states that for any real numbers **a** and **b**,
```latex
|a+b| \leq |a| + |b|
```

#Definition a **Lemma** is an intermediary result that is proven with the goal of supporting a larger proof

---
**Statement:** for any real numbers a and b, |a+b| <= |a| + |b|

  **Lemma-1**: for all real numbers **r, -|r| <= r <= |r|** 

  **Proof of Lemma-1:**

Suppose **r** is any real number, we will consider the cases where **r > 0** ,**r < 0**, or **r = 0**.

  **Case 1 (r > 0):** 
  
By definition of absolute value, **|r| = r** in this case.
Furthermore, since **r** is positive and **-|r|** must be negative, it must be true that **-|r| < r**

Thus, it is true that **-|r| <= r <= |r|** in this case

  **Case 2 (r < 0):**

By definition of absolute value, **|r| = -r** and **-|r| = r** in this case.
Furthermore, since **r** is negative and **|r|** must be positive, it must be true that **r < |r|**

Thus, it is true that **-|r| <= r <= |r|** in this case

  **Case 3 (r = 0):**

It can be shown that **-|0| = 0 = |0|** and thus 
it is true that **-|r| <= r <= |r|** in this case

  **Lemma-2:** for any real number **r, |-r| = |r|** 

  **Proof of Lemma-2:**

By definition,
```latex
|-r| =
\begin{cases}
  -r & \text{if } -r > 0\\
  0 & \text{if } -r = 0\\
  -(-r) & \text{if } -r < 0\\
\end{cases}
```
By basic algebra,
```latex
|-r| =
\begin{cases}
  -r & \text{if } r < 0\\
  0 & \text{if } -r = 0\\
  r & \text{if } r > 0\\
\end{cases}
```
Since -0 = 0,
```latex
|-r| =
\begin{cases}
  r & \text{if } r \geq 0\\
  -r & \text{if } r < 0\\
\end{cases}
```
Which by definition of absolute value is equal to **|r|**

**Proof of Triangle Inequality:**

Let **x** and **y** be any real numbers. We will consider that cases where   **x + y >= 0** and **x + y < 0**

  **Case 1 (x + y >= 0):**

By definition of absolute value, **|x + y| = x + y** in this case.
Furthermore, by Lemma-1, **x <= |x|** and **y <= |y|**

Thus, **|x + y| = x + y <= |x| + |y|**

  **Case 2 (x + y < 0):**

By definition of absolute value, **|x + y| = -(x + y) = (-x) + (-y)** in this case.

Furthermore, by Lemma-1 and Lemma-2, 
**-x <= |-x| = |x|** and **-y <= |-y| = |y|**

Thus, **|x + y| = (-x) + (-y) <= |x| + |y|**

Therefore, the statement is proven for any selection of **x** and **y**

---