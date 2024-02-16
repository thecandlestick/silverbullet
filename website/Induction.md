---
tags: template
trigger: induction
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
**For all integers n >= 8, exact change for n¢s can be made using  only 3¢ and 5¢ coins**

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

#DiscussionQuestion Can we prove more generally that the sum of any _arithmetic sequence_ has a _closed form_ expression? _(difficulty: 🤯)_