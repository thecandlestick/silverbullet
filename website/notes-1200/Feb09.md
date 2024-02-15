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

x = 7b + 4
5x = 35b + 20
5x = 35b + 14 + 6
5x = 7(5b + 2) + 6

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
D_1 = \{ x \in D | A_1 \}\\
D_2 = \{ x \in D | A_2 \}\\
...\\
D_n = \{ x \in D | A_n \}\\
D_v = \{ x \in D | \sim(A_1 \lor A_2 \lor ... \lor A_n) \} \text{ for which the statement is vacuously true }\\
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
#Definition For any real number **x**, the **absolute value of x**, denoted   **|x|**, is defined as:
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