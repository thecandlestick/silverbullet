---
tags: template
trigger: relations
---

# Relations

#Definition Let **A** and **B** be sets. A **relation R from A to B** is a subset of **A x B** _(Cartesian product)_. For given elements **x** in **A** and **y** in **B**, we say that **x is related to y by R**, or **x R y**, if and only if the ordered pair **(x,y)** is in the set **R**

The **inverse** of a _relation_ **R** is defined as:
```latex
R^{-1} = \{(y,x) \in B \times A \mid (x,y) \in R \}
```

_examples:_

Let **A = {1,2}** and **B = {1,2,3}**. Define a _relation_ **R** as follows:
```latex
R = \{(x,y) \in A \times B \mid \frac{x-y}{2} \in \Z \}
```

#DiscussionQuestion Which ordered pairs are included in the relation **R**?
Can **R** be considered a function?

**The _Divides_ Relation**

Let **R** be a _relation_ from **X** to **Y** where:
```latex
x R y \Leftrightarrow x | y\\
X = \{2,3,4\}\\
Y = \{2,6,8\}\\
X \times Y = \{(2,2),(2,6),(2,8),\\
\qquad \qquad \quad (3,2),(3,6),(3,8),\\
\qquad \qquad \quad (4,2),(4,6),(4,8)\}
```

Then **R** = { ? }

... And the inverse **R’** = **(y,x)** where _y is divisible by x_ = { ? }

**The _absolute value_ Relation**

Let **R** be a _relation_ from the set of reals to the set of reals where:
```latex
x R y \Leftrightarrow y = 2|x|
```

Draw graphs of **R** and **R’**. Is either _relation_ also a _function_?

**Types of Relations:**

* **A x A** - Relation on **A**
- **A x B** - Binary Relation (from **A** to **B**)
- **A x B x C** - Ternary Relation
- **A x B x C x D** - Quaternary Relation
- **A1 x A2 x ... x An** - _N-ary_ Relation

**Use case: Relational Databases**

Define the following sets:
* **A** - A set of 8-digit positive integers (_student id_)
* **B** - A set of character strings (_student name_)
* **C** - A set of dates “FS/SP/SS YY” (_student graduation date_)
* **D** - A set of character strings (_student major_)

Now let **R** be a quaternary relation on **A x B x C x D** such that:

  Element **(a,b,c,d)** in **R** means - “A student with ID **a**, named **b**, is set to graduate on **c**, with primary major **d**“

Then a collection of S&T students could be represented by this relation

* (00000001, Joe Miner, FS 70, Mining Engineering)
* (12876543, Joe Schmo, SP 24, Applied Mathematics)
* (12812096, Joe Dirt, SP 26, Mechanical Engineering)
* (12833378, Joe Mama, FS 21, Computer Science)
* (18097865, Joe King, SP 24, Computer Engineering)
* (18001239, Joe Joestar, SP 25, Biology)

In a database, these tuples are thought of as rows in a table with columns for each attribute

| ID | Name | Grad-Year | Major |
|----------|----------|----------|----------|
| 00000001 | Joe Miner | FS 70 | Mining Engineering |
| 12876543 | Joe Schmo | SP 24 | Applied Mathematics |
| 12812096 | Joe Dirt | SP 26 | Mechanical Engineering |
| 12833378 | Joe Mama | FS 21 | Computer Science |
| 18097865 | Joe King | SP 24 | Computer Engineering |
| 18001239 | Joe Joestar | SP 25 | Biology |

A _query language_ such as SQL would then be used to perform operations on this relation, manipulating or retrieving specific elements

  _SELECT Name FROM R WHERE Grad-Year = SP 24_

Would, for example, return a list of Names for every student who is graduating in Spring of 2024. This information can be obtained by performing various set operations

Consider the set: **A x B x {“SP 24”} x D**, call this **Q**

This would correspond to the table:

| ID | Name | Grad-Year | Major |
|----------|----------|----------|----------|
| ... | ... | SP 24 | ... |
| 00000001 | Joe Miner | SP 24 | Mining Engineering |
| 12876543 | Joe Schmo | SP 24 | Applied Mathematics |
| 12812096 | Joe Dirt | SP 24 | Mechanical Engineering |
| 12833378 | Joe Mama | SP 24 | Computer Science |
| 18097865 | Joe King | SP 24 | Computer Engineering |
| 18001239 | Joe Joestar | SP 24 | Biology |
| ... | ... | SP 24 | ... |

Now take the _intersection_ of **R** and **Q**. This result will contain only elements from the original set **R** where _Grad-Year = SP 24_

| ID | Name | Grad-Year | Major |
|----------|----------|----------|----------|
| 12876543 | Joe Schmo | SP 24 | Applied Mathematics |
| 18097865 | Joe King | SP 24 | Computer Engineering |


Now perform a **projection** onto the second coordinate to narrow this table down to the information requested

| Name |
|----------|
| Joe Schmo |
| Joe King |


# Properties of Relations on Sets

A relation on a set **A** can be represented using a _directed graph_

_example:_

Let **A = {3,4,5,6,7,8}**
Define relation **R** on **A** such that:
```latex
x R y \Leftrightarrow 2|(x-y)
```

#BoardQuestion Draw a graph with arrows indicating related elements

_Extra example:_
Let **B = {2,3,4,6,7,9}**
Define relation **R** on **B** such that:
```latex
xRy \Leftrightarrow 3 \mid (x-y)
```


## Reflexivity

#Definition A relation **R** on a set **A** is **reflexive** if and only if for all **x** in **A**, **x R x**
```latex
R\text{ is reflexive} \Leftrightarrow \forall x \in A, (x,x) \in R
```

Another way of wording this property is that in a _reflexive relation_, each element is related to itself.

To demonstrate that a relation is not _reflexive_, you must find an element of **A** that is not related to itself.
```latex
R\text{ is not reflexive} \Leftrightarrow \exists x \in A \text{ such that } (x,x) \notin R
```

#DiscussionQuestion Is the following relation on the set of integers _reflexive_?
```latex
xRy \Leftrightarrow x \times y \text{ is positive}
```

## Symmetry

#Definition A relation **R** on a set **A** is **symmetric** if and only if for all **x,y** in **A**, if **x R y** then **y R x**
```latex
R\text{ is symmetric} \Leftrightarrow \forall x,y \in A, (x,y) \in R \rightarrow (y,x) \in R
```

Another way of wording this property is that in a _symmetric relation_, if any one element is related to another, then the second element is also related to the first.

To demonstrate that a relation is not _symmetric_, you must find two elements of **A** that violate this.
```latex
R\text{ is not symmetric} \Leftrightarrow \exists x,y \in A \text{ such that }(x,y) \in R \land (y,x) \notin R
```

#Definition A relation **R** on a set **A** is **anti-symmetric** if and only if for all **x,y** in **A**, if **x R y** and **y R x** then **x = y**

Another way of wording this property is that the relation **R** has exactly zero _symmetric_ relationships

#DiscussionQuestion Is the following relation on the set of reals _anti-symmetric_?
```latex
xRy \Leftrightarrow x \leq y
```


## Transitivity

#Definition A relation **R** on a set **A** is **transitive** if and only if for all **x,y,z** in **A**, if **x R y** and **y R z** then **x R z**
```latex
R\text{ is transitive} \Leftrightarrow \forall x,y,z \in A, (x,y) \in R \land (y,z) \in R \rightarrow (x,z) \in R
```

Another way of wording this property is that in a _transitive relation_, If any one element is related to a second and that second element is related to a third, then the first element is also related to the third

To demonstrate that a relation is not _transitive_ you must find three elements of **A** that violate this
```latex
R\text{ is not transitive} \Leftrightarrow \exist x,y,z \in A \text{ such that }(x,y) \in R \land (y,z) \in R \land (x,z) \notin R
```


#DiscussionQuestion Let **A = {0,1,2,3}** and 
**R = {(0,0),(0,1),(0,3),(1,0),(1,1),(2,2),(3,0),(3,3)}**
* Is **R** _reflexive_? yes
* Is **R** _symmetric_? yes
* Is **R** _transitive_? no

Let **R** be a relation on the set of reals such that
```latex
xRz \Leftrightarrow x \leq z
```
* Is **R** _reflexive_? yes
* Is **R** _symmetric_? no 
* Is **R** _transitive_? yes


#KnowledgeCheck Let **A = {0,1,2,3}** and **S = {(0,0),(0,2),(0,3),(2,3)}**
* Is **S** _reflexive_?
* Is **S** _symmetric_?
* Is **S** _transitive_?

### Transitive Closure

#Definition Let **R** be a relation on a set **A**, the **Transitive Closure** of **R** is the relation on **A** that satisfies the following:
```latex
R^t \text{ is transitive}\\
R \subseteq R^t\\
\text{If }S\text{ is any other transitive relation that contains }R\text{, then }R^t \subseteq S
```

Another way of wording this is that the _transitive closure_ is the relation with the minimum number of additional elements to convert **R** into a _transitive_ relation

#BoardQuestion
Let **A = {0,1,2,3}** and **R = {(0,1),(1,2),(2,3)}**
Graph the _transitive closure_ of **R**

# Equivalence Relations

#Definition Let **R** be a relation on a set **A**. **R** is an **equivalence relation** if and only if **R** is _reflexive, symmetric,_ and _transitive_

_example:_
Let **A** be a set with partition **{A_0, A_1, ..., A_n}** and let **R** be a relation on **A** such that:
```latex
xRy \Leftrightarrow \exists A_i \text{ such that }x,y \in A_i
```

This relation has a special name. It is the **relation induced by the partition** given.

If we let **A = {0,1,2,3,4}** and consider the partition **{{0,3,4},{1},{2}}**, then the _relation induced by the partition_ is 

**R = {(0,0), (0,3), (0,4), (1,1), (2,2), (3,0), (3,3), (3,4), (4,0), (4,3), (4,4)}**

#DiscussionQuestion Is **R** an _equivalence relation_? Is this the same for all _relations induced by partitions_?

## Equivalence Classes

#Definition Suppose **R** is a relation on a set **A**. For each element **a** in **A**, the **equivalence class** of **a**, denoted [a], is the set of all elements **x** in **A** such that **x** is related to **a** by **R**  
```latex
[a] = \{x\in A\mid xRa\}
```

In general, a relation **R** has as many _equivalence classes_ as there are elements in **A**. Oftentimes, however, we are concerned only with the **distinct equivalence classes** of **R**. That is, all possible sets representing an _equivalence class_ but not tied to a particular element in **A**

_example:_
Let **A = {{1},{2},{3},{1,2},{1,3},{2,3},{1,2,3}}**
Define a relation **R** on **A** such that:
```latex
aRb \Leftrightarrow \text{least element in }a = \text{ least element in }b
```

Then **R = {({1},{1}), ({1},{1,2}), ({1,2},{1}), ({1},{1,3}), 
({1,3},{1}), ({1},{1,2,3}), ({1,2,3},{1}), ({1,2},{1,3}), 
({1,3},{1,2}), ({1,2},{1,2,3}), ({1,2,3},{1,2}), ({1,3},{1,2,3}), ({1,2,3},{1,3}), ({2},{2,3}), ({2,3},{2})}**

List the following _equivalence classes_:
* [{1}] = {{1}, {1,2}, {1,3}, {1,2,3}} **({1,2},{1})**
* [{2}] = {{2}, {2,3}}
* [{3}] = {{3}}

### Properties of Equivalence Classes

#Theorem The following statements are true of all _equivalence relations_ **R** on a set **A**

```latex
\text{If }aRb, \text{ then }[a] = [b]
```

```latex
\text{If }a,b \in A,\text{ then either } [a] \cap [b] = \emptyset \text{ or }[a] = [b]
```

```latex
\{[a] \mid a \in A\} \text{ is a partition of A}
```

#DiscussionQuestion Think carefully about the definition of _reflexive, symmetric, and transitive_. Do they provide some intuition on why the theorems above are true?

## Congruence & Modulo

Consider a relation **R** defined on the set of integers such that:
```latex
mRn \Leftrightarrow k|(m-n)
```
where **k** is some positive integer

This relation is known as **congruence modulo k** due to the fact that it possesses the property that any two integers **m,n** are related if and only if **m _mod_ k = n _mod_ k = 0**.

* Is _congruence modulo k_ a _reflexive_ relation?

```latex
mRm \Leftrightarrow k|(m-m)\\
\Leftrightarrow k|0\\
\Leftrightarrow \exists i \in \Z \text{ such that } i\times k = 0
```

Regardless of the choice of **m** or **k**, it is clear to see that the choice of **i = 0** demonstrates that **R** is _reflexive_

* Is _congruence modulo k_ a _symmetric_ relation?

```latex
\text{Suppose }mRn \Leftrightarrow \exists i \in \Z \text{ such that }i \times k = (m - n)\\
\Leftrightarrow i = \frac{m-n}{k} \text{ is an integer}\\
\text{Now consider the symmetric relationship }nRm \Leftrightarrow \exists j \in \Z \text{ such that }j \times k = (n - m)\\
\text{Let }j = -i, \text{ then }j \times k = -i \times k\\
 = -(\frac{m-n}{k})k = \frac{n-m}{k}k = (n-m)  
```

Therefore, regardless of the choice of **m,n,k**. We can select **i,j** to demonstrate that **R** is _symmetric_

* Is _congruence modulo k_ a _transitive_ relation?

Using the property:
```latex
mRn \Leftrightarrow m \% k = n \% k = 0
```

We can see that,
```latex
mRn \land nRw \Leftrightarrow (m \% k = n \% k = 0) \land (n \% k = w \% k = 0)\\
 \Leftrightarrow m \% k = n \% k = w \% k = 0 
```

And by specification,
```latex
m \% k = w \% k = 0 \Leftrightarrow mRw
```

Therefore, regardless of the choice of **m,n,w**, the properties of _congruence modulo k_ dictate that it must be _transitive_

#DiscussionQuestion What are the _distinct equivalence classes_ of _congruence modulo 3_?

```latex
mRn \Leftrightarrow 3|(m-n)\\

[a] = \{x \in \Z \mid xRa\} = \{x \in \Z \mid 3|(x-a)\} = \{x \in \Z \mid \exists k \in \Z \text{ such that } 3k = x-a\} = \{x \in \Z \mid \exists k \in \Z \text{ such that } x = 3k+a\}\\
[0] = \{x \in \Z \mid \exists k \in \Z \text{ such that } x = 3k+0\}\\
[1] = \{x \in \Z \mid \exists k \in \Z \text{ such that } x = 3k+1\}\\
[2] = \{x \in \Z \mid \exists k \in \Z \text{ such that } x = 3k+2\}\\
[3] = \{x \in \Z \mid \exists k \in \Z \text{ such that } x = 3k+3\}\\
...
```

dl
