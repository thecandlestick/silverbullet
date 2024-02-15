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

# Sequences

#Definition A **sequence** is a function whose domain is either all the integers between two given integers or all the integers greater than or equal to a given integer

The value of the function for a given input **n** is called the **n-th term** of the sequence

_examples:_
* 2, 4, 8, 16, 32, ...
* 1, 2, 3, ...

## Determining a Formula

Though not all sequences must follow an explicit formula, it is common to express sequences by giving an equation for calculating an arbitrary term by its index

_examples:_
```latex
A_k = 2^k\\
A_k = k\\
A_k = A_{k-1} + A_{k-2}, A_1 = 1, A_2 = 2
```

## Finding terms given explicit formulas

If an explicit formula is available, obtaining any term of the sequence becomes trivial

```latex
a_k = \frac{k}{k+1}, k \geq 1\\
b_i = \frac{i-1}{i}, i \geq 2\\
c_j = (-1)^j, j \geq 0
```

#DiscussionQuestion What are the values of the following terms?
* a_5 **5/6**
* b_1 **not defined** **1/2?**
* c_12345678987654321 **-1** 

## Determining a Formula from Terms

_example:_
```latex
1, -\frac{1}{4}, \frac{1}{9}, -\frac{1}{16}, \frac{1}{25}, -\frac{1}{36}, ...
```

_explicit formula:_ ___
```latex
d_n = \frac{1}{n^2}(-1)^{n+1}
```


#Definition An **arithmetic sequence** is a sequence of the form:
```latex
a_n = a_1 + (n-1)*d
```
where **d** is a _common difference_ separating each term

#Definition a **geometric sequence** is a sequence of the form:
```latex
a_n = a_1*r^{n-1}
```
where **r** is a _common ratio_ between each term

Many sequences can be categorized as either an _arithmetic sequence_ (if it is obtained by repeated addition)
or as a _geometric sequence_
(if is is obtained by repeated multiplication)

#KnowledgeCheck Is the following sequence _arithmetic_ or _geometric_?
```latex
1, \frac{7}{2}, 6, \frac{17}{2}, 11, ...
```
If _arithmetic_, give the common difference **d**
If _geometric,_ give the common ratio **r**

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

_ans:_
```latex
\sum_{i=1}^{n+1} = \frac{i}{n + i - 1}
```


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
