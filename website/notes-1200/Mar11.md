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
| 00000001 | Joe Miner | SP 24 | Mining Engineering |
| 12876543 | Joe Schmo | SP 24 | Applied Mathematics |
| 12812096 | Joe Dirt | SP 24 | Mechanical Engineering |
| 12833378 | Joe Mama | SP 24 | Computer Science |
| 18097865 | Joe King | SP 24 | Computer Engineering |
| 18001239 | Joe Joestar | SP 24 | Biology |

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
