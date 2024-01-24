---
tags: template
trigger: predicate-logic
---

# Predicates

#Definition A **predicate** is a sentence that contains a finite number of variables and becomes a _proposition_ when specific values are substituted for the variables

_example:_ **2x > x** is not a _proposition_, but it is a _predicate_

#Definition The **domain** of a predicate variable is the set of all values that may be substituted in place of the variable

_examples:_ 
```latex
\Z , \R , \N , \Complex , \Z^- , (0,1) , \R / \{ 42 \} , ...
```

#Definition The **truth set** of a _predicate_ **P(x)** with _domain_ **D** is the set of all elements of D that make P(x) a true statement when substituted for x

In set-builder notation, this is denoted:
```latex
\{x \in D | P(x) \}
```

_example:_
```latex
\{ x \in \Z^+ | \frac{10}{x} > 1 \}
```
represents the set
{1, 2, 3, 4, 5, 6, 7, 8, 9}


## Comparing Truth Sets

Let **P(x)** and **Q(x)** be predicates with domain **D**

The notation
```latex
P(x) \Rightarrow Q(x)
```
is a _proposition_ that means every element in the _truth set_ of **P(x)** is also in the _truth set_ of **Q(x)**. This can also be written as:
```latex
\forall x \in D, P(x) \rightarrow Q(x)\\
\text{or}\\
\{x \in D | P(x)\} \subseteq \{x \in D | Q(x)\}
```

The notation
```latex
P(x) \Leftrightarrow Q(x)
```
is a _proposition_ that the _truth set_ of **P(x)** is exactly equal to the _truth set_ of **Q(x)**. This can also be written as:
```latex
\forall x \in D, P(x) \leftrightarrow Q(x)\\
\text{or}\\
P(x) \Rightarrow Q(x) \land Q(x) \Rightarrow P(x)
```

#BoardQuestion Compare the _truth sets_ of the following _predicates_. Let the _domain_ be the set of all positive integers for each.
* Q(n) = “n is a factor of 8”
* R(n) = “n is a factor of 4”
* S(n) = “n < 5 and n is not 3”

#KnowledgeCheck Let **P(x)** = “x < 1” and Let **Q(x)** = “x > x^2”
Using the domain **D** = {-2, -1, 0, 1, 2} , is the following _proposition_ true or false?
```latex
P(x) \Leftrightarrow Q(x) 
```
_hint: construct the truth sets if you’re unsure_

---
# Quantified Statements

A **Quantified Statement** is a _proposition_ that makes a logical claim about a _quantity_ of elements in the domain of a _predicate_ using terms such as “all”, “every”, “some”, or “at least one”

## Universal Statements

_note: the symbol ∀ is read as “for all”_

#Definition a **universal statement** is a proposition with the form:
```latex
\forall x \in D, Q(x)
```
where **Q(x)** is a _predicate_ and **D** is the _domain_ of **x**

A _universal statement_ is defined to be _true_ if and only if **Q(x)** is true for _every_ value of **x** in **D**

A _universal statement_ is _false_ if and only if **Q(x)** is false for _at least one_ value of **x** in **D**. This is known as a **counterexample**

_example:_ If D is the set {1, 2, 3, 4, 5}, then
```latex
\forall x \in D, x^2 \geq x
```
is a _universal statement_

#DiscussionQuestion is the above statement _true_ or _false_? How would you prove your answer?

## Existential Statements

_note: the symbol ∃ is read as “there exist(s)”_

#Definition An **existential statement** is a _proposition_ with the form:
```latex
\exists x \in D \text{ such that } Q(x)
```
where **Q(x)** is a _predicate_ and **D** is the _domain_ of **x**

An _existential statement_ is defined to be _true_ if and only if **Q(x)** is true for _at least one_ value of **x** in **D**

An _existential statement_ is _false_ if and only if **Q(x)** is false for _every_ value of **x** in **D**

_example:_
```latex
\exists m \in \Z^+ \text{ such that } m^2 = m
```
is an _existential statement_

#DiscussionQuestion is the above statement _true_ or _false_? How would you prove your answer?

## Universal Conditional Statements

#Definition a **universal conditional statement** is a _proposition_ with the form:
```latex
\forall x \in D, P(x) \rightarrow Q(x)
```
where **P(x)** and **Q(x)** are _predicates_ and **D** is the domain of **x**

A _universal conditional statement_ is defined to be _true_ if and only if _every_ value of **x** in **D** that makes **P(x)** true also makes **Q(x)** true

A _universal conditional statement_ is false if and only if there is _at least one_ value of **x** in **D** that makes **P(x)** true and **Q(x)** false

_example:_
```latex
\forall x \in \R , x > 2 \rightarrow x^2 > 4 
```
is a _universal conditional statement_

### Necessary & Sufficient Conditions

The concepts of _necessary_ and _sufficient_ conditions can be extended for _predicates_ using _universal conditional statements_.

For _predicates_ **R(x)** and **S(x)** with domain **D**,

```latex
\forall x \in D, R(x) \text{ is a sufficient condition for } S(x)
```
means
```latex
\forall x \in D, R(x) \rightarrow S(x)
```

```latex
\forall x \in D, R(x) \text{ is a necessary condition for } S(x)
```
means
```latex
\forall x \in D, \sim R(x) \rightarrow \sim S(x)
```


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
\forall m \in \R^+ , \exists n \in \R^+ \text{ such that } \sim (m \leq n)
```
```latex
\forall m \in \R^+, \exists n \in \R^+ \text{ such that } m > n
```

#DiscussionQuestion Are the statements given above _true_? What would be sufficient evidence to declare them as _false_?

## Negating Statements with Multiple Quantifiers

#Theorem The _negation_
```latex
\sim (\forall x \in D, \exists y \in E \text{ such that } P(x,y))
```
is a _quantified statement_ with the form:
```latex
\exists x \in D \text{ such that } \forall y \in E, \sim P(x,y)
```

#Theorem The _negation_
```latex
\sim (\exists x \in D \text{ such that } \forall y \in E, P(x,y))
```
is a _quantified statement_ with the form:
```latex
\forall x \in D, \exists y \in E \text{ such that } \sim P(x,y)
```

The negations of more complex _quantified statements_ such as these can be computed manually using a substitution of variables

#BoardQuestion Give the negation of the following _quantified statement_:
```latex
\exists x \in D \text{ such that } \exists y \in E \text{ such that } P(x,y)
```
