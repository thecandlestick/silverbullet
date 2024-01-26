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


#BoardQuestion Re-write the following sentences using _quantified statements_. Which, if any, are the same? 

* The square of each real number is 2
* Some real numbers have square 2
* The number x has square 2 for some real number x
* If x is a real number, then x^2 = 2
* Some real number has square 2
* There is at least one real number whose square is 2

## Negating Quantified Statements

#Theorem The _negation_ of a _universal statement_
```latex
\sim (\forall x \in D, Q(x))
```
is an _existential statement_ with the form:
```latex
\exists x \in D \text{ such that } \sim Q(x)
```

#Theorem The _negation_ of an _existential statement_
```latex
\sim (\exists x \in D \text{ such that } Q(x))
```
is a _universal statement_ with the form:
```latex
\forall x \in D, \sim Q(x)
```

#Theorem The _negation_ of a _universal conditional statement_
```latex
\sim (\forall x \in D, P(x) \rightarrow Q(x))
```
is an _existential statement_ with the form:
```latex
\exists x \text{ such that } (P(x) \land \sim Q(x))
```

#Theorem
```latex
\sim (\exists x \in D, P(x) \rightarrow Q(x))
```

```latex
\forall x \in D, (P(x) \land \sim Q(x))
```


#DiscussionQuestion Suppose you have an empty bowl and various-colored balls beside it. If you make the claim “all the balls in the bowl are blue”, have you made a _true_ statement or a _false_ statement?

negation:
“there exists a ball in the bowl that is not blue”

---

# Statements with Multiple Quantifiers

Beware of sentences that can have an ambiguous meaning such as:
“**There is a person supervising every detail of the production process**”

It is sometimes necessary to use statements containing multiple quantifiers in order to make your meaning clear

_examples:_
* _For every detail of the production process, there exists a person who is the supervisor of that particular detail_

* _There exists a single person who is the supervisor for all details of the production process_

For a predicate **P(x,y)** with a domain **D** for **x** and a domain **E** for **y**:
```latex
\forall x \in D, \exists y \in E \text{ such that } P(x,y)
```
is a _proposition_ that means no matter the choice of the value for **x**, you can always find a corresponding value for **y** that makes **P(x,y)** _true_

```latex
\exists x \in D \text{ such that } \forall y \in E, P(x,y)
```
is a _proposition_ that means there is at least one choice of the value for **x** such that no matter the choice of the value for **y**, **P(x,y)** is always _true_

_examples:_
```latex
\exists m \in \Z^+ \text{ such that } \forall n \in \Z^+, m \leq n
```
```latex
\exists m \in \R^+ \text{ such that } \forall n \in \R^+, m \leq n
```
```latex
\forall m \in \R^+ , \exists n \in \R^+ \text{ such that } m \leq n
```
```latex
\forall m \in \mathbb{Q}^+, \exists n \in \mathbb{Q}^+ \text{ such that } m > n\\

```

#DiscussionQuestion Are the statements given above _true_? What would be sufficient evidence to declare them as _false_?
