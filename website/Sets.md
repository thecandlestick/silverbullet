---
tags: template
trigger: sets
---

# Set Theory

#Definition A **set** is an _unordered_ collection of _unique_ elements

The **empty set**, denoted ∅, is the set containing no elements

**Set-builder notation** allows you to conveniently define a set of elements that share a common _property_.

Suppose **S** is a set and **P(x)** is a predicate accepting element **x**, then
```latex
A = \{x \in S | P(x) \}
```
**A** is the set of all **x** in **S** such that **P(x)** is _true_


#Definition If **A** and **B** are sets, **A is a subset of B** if and only if every element of **A** is also an element of **B**
```latex
A \subseteq B \leftrightarrow \forall x, x \in A \rightarrow x \in B
```
```latex
A \nsubseteq B \leftrightarrow \exists x \text{ such that } x \in A \land x \notin B
```

#Definition If **A** and **B** are sets, **A is a proper subset of B** if and only if **A** is a subset of **B** and there is at least one element of **B** that is not an element of **A**
```latex
A \subset B \leftrightarrow A \subseteq B \land (\exists x \in B \text{ such that } x \notin A)
```

## Proving the Subset Property

Statements such as _A is a subset of B_ can often be proven directly

1. Suppose generic element of A
2. Using only definitions, theorems, and rules of logical inference, demonstrate that element must belong to B
3. Conclude that A is a subset of B

_example:_
```latex
A = \{m\in \Z \mid \exists r \in \Z \text{ s.t. } m = 6r+12 \}\\
B = \{n \in \Z \mid \exists s \in \Z \text{ s.t. }n=3s \}
```

Suppose m is any element of A. 
Then m = 6r + 12 = 3(2r + 4) for some integer r.
Now let s = 2r + 4, which is an integer by closure.
It follows that m = 3s and m must be an element of B.

Therefore, A is a subset of B

#DiscussionQuestion Using A and B defined above, is B a subset of A?

#Theorem If A and B are sets, then A _is equal to_ B if and only if A is a subset of B and B is a subset of A
```latex
A = B \leftrightarrow A \subseteq B \land B \subseteq A
```

#DiscussionQuestion For A and B defined below, is A = B?
```latex
A = \{ m \in \Z \mid \exists a \in \Z \text{ s.t. }m=2a \}\\
B = \{ n \in \Z \mid \exists b \in \Z \text{ s.t. }n=2b-2 \}
```

## Set Operations

Let **S** be the _universal set_ (scope/context) for the definitions below

#Definition If A and B are sets, the **union** of A and B is the set containing all elements that belong to A or belong to B.
```latex
A \cup B = \{x \in S \mid x \in A \lor x \in B \}
```

#Definition If A and B are sets, the **intersection** of A and B is the set containing all elements that belong to both A and B.
```latex
A \cap B = \{x\in S \mid x \in A \land x \in B \}
```

#Definition If A and B are sets, the **difference** of A and B is the set of all elements that belong to A but do not belong to B.
```latex
A - B = \{x\in S \mid x\in A \land x\notin B\}
```

#Definition If A is a set, the **complement** of A is the set of all elements which do not belong to A.
```latex
A^c = \{x\in S \mid x\notin A\}
```

#note add venn diagrams

## Subsets as Intervals

**Intervals** can also be expressed as subsets of the (real) number-line.

```latex
(a,b] = \{x \in \R \mid a < x \leq b\}
```

#DiscussionQuestion Let A and B be defined as
```latex
A = (-1,0] = \{x\in \R \mid -1 < x \leq 0 \}\\
B = [0,1) = \{x\in\R\mid 0\leq x < 1 \}
```
How could we express the following as _intervals_?
```latex
A \cup B\\
A \cap B\\
B - A\\
A^c
```

