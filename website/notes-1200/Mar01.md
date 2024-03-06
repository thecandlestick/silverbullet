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

# Functions

#Definition A function **f** from a set **X** to a set **Y**, denoted **f: X -> Y**, is relation from **X**, the **domain**, to **Y**, the **co-domain**. Functions must satisfy the following properties:
* Every element in **X** is related to some element in **Y**
* No element in **X** is related to more than one element in **Y**

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
