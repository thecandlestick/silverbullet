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

* [x] inductive proofs (6pm)  📅2024-03-06 #cs1200task

# Functions

#Definition A function **f** from a set **X** to a set **Y**, denoted **f: X -> Y**, is relation from **X**, the **domain**, to **Y**, the **co-domain**. Functions must satisfy the following properties:
* Every element in **X** is related to some element in **Y**
* No element in **X** is related to more than one element in **Y**

Two functions **f: X->Y, g: X->Y** are **equivalent** if and only if **f(x) = g(x)** for all **x in X**

#Definition For any element **x** in the domain, the _unique_ element in **Y** that **x** relates to is called the **image of x under f** and is denoted **f(x)**
_Equivalently,_
* **f of x**
* the **output of f for the input x**
* the **value of f at x**

#Definition The set of all _outputs_ of **f** is called the **range of f** or the **image of X under f**
```latex
\text{range of f} = \{y \in Y \mid y = f(x),\text{ for some }x\in X \}
```

An element in the _domain_ relates to exactly one value in the _co-domain_, but an element in the _co-domain_ can be related to by multiple elements of the _domain_.

#Definition If **f(x) = y**, then **x** is called a **pre-image** of **y**. The set of all _pre-images_ of a given **y** is called the **inverse image** of **y**
```latex
\text{inverse image of y} = \{x\in X \mid f(x) = y \}
```

## Examples of Functions

If **X** is any set, then the **identity function on X** is defined: 
  **I(x) = x** for all **x** in **X**

**Sequences**

Recall the definition of a sequence: _a function whose domain is the set of all integers greater than or equal to some fixed integer_

Any function **f: X -> Y** can therefore be thought of as a sequence so long as **X** is of the form **{a, a+1, a+2, ... }** where **a** is any integer.

The _range of f_ **{f(a), f(a+1), f(a+2), ...}** is then a sequence of values in **Y** whose order is determined by their corresponding element in **X**

_example:_

The sequence
```latex
1, -\frac{1}{2}, \frac{1}{3}, -\frac{1}{4}, ...
```

can be expressed by the function
```latex
f: \Z^+\rightarrow \R = \frac{(-1)^{n+1}}{n}\\
```


**Functions on Sets**

Functions can be defined using any two sets as _domain_ and _co-domain_, including sets where the elements are also sets such as the _power-set_

Recall the definition of the _power-set_: 
  _Power-set(A)_ = { _all possible subsets of A_ }

Consider the following example function
```latex
F: \mathbb{P}(\{a,b,c\}) \rightarrow \Z^{non-neg}\\
\text{where }F(X) = \text{ the number of elements in X}
```

**Logarithmic functions**

#Definition Let **b** be any positive real number such that **b != 1**. For each positive real number **x**, the **logarithm with base b of x** is the exponent to which **b** must be raised to obtain **x**
```latex
log_bx = y \Leftrightarrow b^y = x
```

#DiscussionQuestion Find the following logarithms
```latex
log_3(9)\\
log_2(\frac{1}{2})\\
log_{10}(1)\\
log_2(2^m)
```
* 2
* -1
* 0
* m

**Simple Encoding / Decoding function**

When sending a digital signal across an analog transmission medium (i.e. phone lines, wireless signals, etc.) there is always the possibility of mistakes due to noise or interference.

A solution to this problem is to make use of an **encoding function** that will accept the message to be sent and convert it into a different representation that is less error-prone before transmitting. A **decoding function** is then used by the receiver to return to the original message.

_example:_

Consider the message to be sent represented as a string of 0 and 1
      **010110**

Each bit has some probability of accidentally “flipping” during transmission. However, in practice, the likelihood of multiple flips in a row is quite small.

Let **B** be the set of all binary strings. Consider a simple encoding function **E: B -> B** such that for all **s** in **B**,

  **E(s)** = _the string obtained by replacing each bit in **s** by three redundant copies_

Then the message actually sent becomes 
      **000111000111111000**

And the corresponding _decoding function_ **D: B -> B** is defined:

  **D(s)** = _the string obtained by replacing any three consecutive matching bits of **s** with a single bit_

Which will map the received signal to the original message before encoding

#DiscussionQuestion What is an advantage gained by introducing the encoding / decoding functions? How could **D** be modified to offer more robust communication?

**Boolean Functions**

Think back to propositional logic and predicates. A _predicate_ can be thought of as a function with a _co-domain_ of {0,1} (true/false)

Truth tables, in general, consider different possible combinations of inputs to _statement variables_ and the resulting true/false values for the conclusion. These can also be represented as functions with a _co-domain_ of {0,1}

_example:_

Draw an arrow diagram representation for the following truth table 
_note: 1 = true , 0 = false_
| P | Q | R | (P ^ Q) v R|
|----------|----------|----------|----------|
| 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 |

#Definition An _(n-th place)_ **Boolean function** _f_ is a function whose domain is the set of all ordered n-tuples of 0’s and 1’s and whose _co-domain_ is the set {0, 1}. 
```latex
f: \{0,1\} \times \{0,1\} \times ... \times \{0,1\} \rightarrow \{0,1\}\\
\text{equivalently: }f: \{0,1\}^n \rightarrow \{0,1\}
```

# Properties of Functions

## Injective Functions

#Definition A _function_ **f: X->Y** is called an **injective function** or **one-to-one** if and only if for _any_ two elements **a, b** from the _domain_, if **f(a) = f(b)** then **a = b**
```latex
f: X \rightarrow Y \text{ is injective} \Leftrightarrow \forall a,b\in X, f(a) = f(b) \rightarrow a = b
```

Another way to interpret this property is that no two _distinct_ elements of the _domain_ can share the same _output_.
```latex
f: X \rightarrow Y \text{ is injective} \Leftrightarrow \forall a,b\in X, a \ne b \rightarrow f(a) \ne f(b)
```

To prove that a function is not _injective_, it suffices to show that there exists two distinct inputs from the _domain_ that produce the same output
```latex
f: X \rightarrow Y \text{ is not injective} \Leftrightarrow \exists a,b\in X\text{ such that } f(a) = f(b) \land a \ne b
```

#DiscussionQuestion Are the following _injective functions_?
```latex
f(x):\R \rightarrow \R = 4x - 1\\
g(n):\R \rightarrow \R = n^2
```

## Surjective Functions

#Definition A function **f: X->Y** is called a **surjective function** or **onto** if and only if for _any_ element **y** of the _co-domain_, there exists some element **x** of the _domain_ such that **f(x) = y**
```latex
f: X \rightarrow Y\text{ is surjective }\Leftrightarrow \forall y \in Y, \exists x \in X \text{ such that }f(x) = y
```


Another way to interpret this property is that the _range of f_ is equal to the _co-domain of f_.
```latex
f: X \rightarrow Y\text{ is surjective }\Leftrightarrow Y = \{f(x) \mid x \in X\}
```


To prove that a function is not _surjective_, you must find an element of the _co-domain_ that is not related to by any element from the _domain_
```latex
f: X \rightarrow Y \text{ is not surjective }\Leftrightarrow \exists y \in Y \text{ such that }\forall x \in X, f(x) \ne y
```


#DiscussionQuestion Are the following _surjective_ functions?
```latex
f(x):\R \rightarrow \R = 4x-1\\
h(n):\Z \rightarrow \Z = 4n-1
```

## Bijections & Inverse Functions

#Definition A function **f: X -> Y** is called a **bijection** or **one-to-one correspondence** from **X** to **Y** if and only if **f** is both _injective_ and _surjective_

#Definition The **inverse function** of a _bijection_ **f: X -> Y** is the function **f’: Y -> X** that, given an element **y** in **Y**, produces as output the unique element **x** in **X** such that **f(x) = y**
```latex
\text{let }f:X\rightarrow Y\text{ be any bijective function}\\
f^{-1}(y):Y\rightarrow X\text{ is the inverse of }f \Leftrightarrow \forall y \in Y, (f^{-1}(y) = x) \Leftrightarrow (y = f(x))
```

#DiscussionQuestion Think back to the definition of a function, is it necessary for a function to be a _bijection_ in order to have an _inverse_? Does every _bijection_ have an _inverse_ function?

