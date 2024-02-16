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

# Summations and Products of Sequences

In addition to calculating individual terms of a sequence, it is often helpful to denote the sum or product of consecutive terms.

## Summation Notation vs Expanded Form

#Definition if m and n are integers and m <= n, then the symbol
```latex
\sum_{k=m}^na_k
```
read as the **summation form from k equals m to n of a-sub-k**, is the sum of all terms in the sequence.
```latex
a_m + a_{m+1} + a_{m+2} + ... + a_n
```
is known as the **expanded form** of the sum and is equivalent to the summation form
```latex
\sum_{k=m}^na_k = a_m + a_{m+1} + a_{m+2} + ... + a_n
```

In the example above, **k** is the **index** of the summation, 
**m** is the **lower limit** of the summation, 
and **n** is the **upper limit** of the summation

_examples:_ 

Expand the following summation (convert to expanded form)
```latex
\sum_{i=0}^n\frac{(-1)^i}{i+1}
```

_ans:_
```latex
\frac{(-1)^0}{0+1} + \frac{(-1)^1}{1+1} + \frac{(-1)^2}{2+1} + ... + \frac{(-1)^n}{n+1}
```

Express in summation notation
```latex
\frac{1}{n} + \frac{2}{n+1} + \frac{3}{n+2} + ... + \frac{n+1}{2n}
```

_ans:_ ___

## Changing End Terms of a Sequence

Often times, summations require adjustment to better suit a mathematical argument or to adhere to some known theorem. We’ll go over some common methods of working with summations here

_examples:_

**Re-write as a summation from 1 to n**
```latex
\sum_{i=1}^{n+1}\frac{1}{i^2}
```

_ans:_

```latex
\frac{1}{(n+1)^2} + \sum_{i=1}^n\frac{1}{i^2}
```

**Express as a single summation**
```latex
\sum_{k=0}^n2^k + 2^{n+1}
```

_ans:_

```latex
\sum_{k=0}^{n+1}2^k
```


## Changing the Variables of a Sequence

In addition to adding and removing terms from the summation notation, you can also perform a change of variables on the _index_ of the sum.

_example:_

**Change to index j where j = k+1**
```latex
\sum_{k=0}^6\frac{1}{k+1}
```

_ans:_

```latex
\sum_{j=1}^7\frac{1}{j}
```

Don’t forget to change all three of:
* The expression for the k-th / j-th term
* The lower limit
* The upper limit

#DiscussionQuestion How can we express the following as a sum with a lower limit of 1?
```latex
\sum_{k=0}^n \frac{k+1}{n+k}
```

q = k + 1
k = q - 1

lower limit = 1
upper limit = n + 1

```latex
\sum_{q=1}^{n+1} \frac{q}{n+q-1}
```


## Telescoping sums

_notice the following:_
```latex
\frac{1}{k}-\frac{1}{k+1} = \frac{k+1}{k(k+1)}-\frac{k}{k(k+1)} = \frac{1}{k(k+1)}
```

This gives a unique property to summations of the form
```latex
\sum_{k=1}^n\frac{1}{k(k+1)} = \sum_{k=1}^n(\frac{1}{k}-\frac{1}{k+1})
```

Expanding this sum we see that certain terms cancel each other
```latex
(\frac{1}{1} - \frac{1}{2}) + (\frac{1}{2} - \frac{1}{3}) + ... + (\frac{1}{n} - \frac{1}{n+1})
```
By associativity of the real numbers is equal to...
```latex
\frac{1}{1} + (- \frac{1}{2} + \frac{1}{2}) + (- \frac{1}{3} + \frac{1}{3}) + ... + (- \frac{1}{n} + \frac{1}{n}) - \frac{1}{n+1}
```

Which leaves us with a formula of
```latex
\sum_{k=1}^n\frac{1}{k(k+1)} = 1 - \frac{1}{n+1}
```

#Definition A sum is said to have a **closed form** expression if it can be shown to be equal to a formula not containing ellipsis(**...**) or summation symbols(**∑**)

## Product notation

#Definition If m and n are integers and m <= n, then the symbol
```latex
\prod_{k=m}^na_k
```
read as the **product from k equals m to n of a-sub-k**, is the product of all terms in the sequence
```latex
\prod_{k=m}^na_k = a_m*a_{m+1}*a_{m+2}* ... *a_n
```

_example:_
```latex
\prod_{k=1}^5a_k = a_1a_2a_3a_4a_5
```

#Definition For each positive integer n, the quantity **n factorial**, denoted **n!**, is defined as the product of all the integers from 1 to n.
```latex
n! = \prod_{k=1}^nk = n*(n-1)* ... *3*2*1
```
The **zero factorial**, denoted **0!**, is defined to be 1
```latex
0! = 1
```

## Properties of sums and products

#Theorem Given any two sequences of real numbers
```latex
a_m, a_{m+1}, a_{m+2}, ... \quad\text{ and }\quad b_m, b_{m+1}, b_{m+2}, ...
```
The following statements hold for any integer n >= m
```latex
\sum^n_{k=m}a_k + \sum_{k=m}^nb_k = \sum_{k=m}^n(a_k + b_k)
```
```latex
c*\sum_{k=m}^na_k = \sum_{k=m}^nc*a_k
```
Where c is any real number
```latex
(\prod_{k=m}^na_k)*(\prod_{k=m}^nb_k) = \prod_{k=m}^n(a_k*b_k)
```

#BoardQuestion Let a_k = k+1 and b_k = k-1 for all integers k

Write the following as a single summation
```latex
\sum_{k=m}^na_k + 2*\sum_{k=m}^nb_k
```

Write the following as a single product
```latex
(\prod_{k=m}^na_k)*(\prod_{k=m}^n b_k)
```

---

#Quote _Mathematical induction is the standard proof technique in computer science
  -Anthony Ralston, 1984_

# Mathematical Induction

#Definition A **proof by induction** seeks to prove that a property **P(x)** holds for a (possibly infinite) sequence of elements by proving **P(x)** must hold for consecutive elements in the domain

Let **P(n)** be a property or predicate that is defined for integers **n**, and let **a** be a fixed integer

Now consider the following (valid) argument:
```latex
\forall k \geq a, P(k) \rightarrow P(k+1)\\
P(a)\\
\therefore \forall n \geq a, P(n)
```

The principle being applied here is similar to a (possibly infinite) chain of dominoes. **P(a)** is proven true directly, and by the major premise provides proof that **P(a+1)** is true, which provides proof that **P(a+2)** is true, which provides proof that **P(a+3)** is true, ...

_A proof by induction is structured as follows:_

1. **Define your property P(x)**, The statement to be proved should be of the form: **“For all integers n >= a, P(n) is true”**
   
2. **Basis Step:** Prove that **P(a)** is _true_

3. **Inductive Step:** Prove that for all integers **k >= a**, if **P(k)** is true then **P(k+1)** must be true as well
  * **State the inductive hypothesis**: Suppose **P(k)** is true, where **k** is any particular but arbitrarily chosen integer with **k >= a**
  * **Show P(k+1) is true** using only the _inductive hypothesis_, definitions, and known rules of logical inference

4. Conclude the original statement is true, **for all integers n >= a, P(n) is true**

_example:_

Prove the following by mathematical induction:
**For all integers n >= 8, exact change for n¢ can be made using  only 3¢ and 5¢ coins**

Let us begin by defining our property, **P(x)**
```latex
P(x) := \exists a, b \in \Z^+ \text{ such that } x = 3a + 5b
```

Now our property does not hold for every value of x (take x = 4 for example), but the statement to be proved only considers values greater than or equal to 8

For the _basis step_, we will prove that **P(8)** is true. For this, a _constructive proof of existence_ will suffice

Let **a = b = 1**, then **8 = 3a + 5b = 3(1) + 5(1)**
Therefore, **P(8)** is _true_

For our _inductive step_, we seek to prove the following statement:
```latex
\forall k \geq 8, P(k) \rightarrow P(k+1)
```

Starting with our _inductive hypothesis_: **Suppose k is any integer such that k >= 8 and P(k) is true**. We must show that it follows logically that **P(k+1)** is true as well.

Since **P(k)** is true, there exist non-negative integers **a** and **b** such that **k = 3a + 5b**

We will prove the inductive step by division into cases
  **Case 1 (b > 0):**

In this case, consider the act of exchanging a 5¢ coin for two 3¢ coins. This would increase the total sum by one.

```latex
k = 3a + 5b\\
k = 3(a+2) + 5(b-1) - 1\\
k + 1 =  3(a+2) + 5(b-1)
```

Let **c = a + 2** and **d = b - 1**
Since **c** and **d** are both non-negative integers, it follows by definition that **P(k+1)** is _true_ in this case

  **Case 2 (b = 0):**

In this case, there are no 5¢ coins to exchange. We can assume, however, that because **k >= 8** at least three 3¢ coins must have been used to total **k**. Consider instead the act of exchanging three 3¢ coins for two 5¢ coins

```latex
k = 3a + 5b\\
k = 3(a-3) + 5(b+2) - 1\\
k + 1 = 3(a-3) + 5(b+2)
```

Let **c = a - 3** and **d = b + 2**
Since **c** and **d** are both non-negative integers, it follows by definition that **P(k+1)** is _true_ in this case

Now we have proven the _inductive step_. Together with the _basis step_, we form our conclusion

**Therefore, by mathematical induction, for all integers n >= 8, exact change for n¢ can be made using only 3¢ and 5¢ coins**


#BoardQuestion Use a proof by induction for the following statement:
```latex
\forall n \geq 1, \sum_{i=1}^ni = \frac{n(n+1)}{2}
```

1 + 2 + 3 + 4 + 5 = 5(5+1)/2

15 = 5(6)/2 = 15

#DiscussionQuestion Can we prove more generally that the sum of any _arithmetic sequence_ has a _closed form_ expression? _(difficulty: 🤯)_
