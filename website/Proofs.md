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
3. **Prove the _contrapositive_ form directly**

---
## Proof by Division into Cases

A _proof by division into cases_ is structured as follows:

1. **Divide the domain, D, of the statement to be proved into two or more sub-domains**
  2. You must be able to show that these sub-domains together contain every element of D
3. **Prove the statement for each sub-domain individually**
4. **Conclude the statement must be true for the whole domain, D**