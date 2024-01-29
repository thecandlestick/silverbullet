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

#DiscussionQuestion Translate the following sentences using quantified statements:
* “Every nonzero real number has a *reciprocal”
* “There is a real number with no reciprocal”

```latex
\forall x \in \R / \{0\}, \exist y \in \R / \{0\} \text{ such that } xy = 1
```


*_the **reciprocal** of a real number a is a real number b such that_ 
**a x b = 1**

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

The negations of more complex _quantified statements_ can be computed manually using a careful substitution of variables

#BoardQuestion Give the negation of the following _quantified statement_:
```latex
\exists x \in D \text{ such that } \exists y \in E \text{ such that } P(x,y)
```

# Valid Arguments

#Definition an **argument** is a sequence of _statements_ ending in a _conclusion_. The statements leading up to the conclusion are known as **premises** (also _hypotheses, assumptions_)

_example:_
* If Socrates is a man, then Socrates is mortal _(premise)_
* Socrates is a man _(premise)_
* Therefore, Socrates is mortal _(conclusion)_

#Definition an **argument form** is a sequence of _statement forms_ ending in a conclusion

_example:_
```latex
p \rightarrow q\\
p\\
\therefore q
```
_note: **∴** is read as “therefore” and is used to identify the conclusion_

In the field of logic, an _argument_ is ==not== a _dispute_. We don’t use terms such as “right” or “wrong” when referring to a logical _argument_ or _argument form_. We instead care about if the argument is _valid_ or _invalid_.

#Definition An _argument form_ is **valid** if and only if the truth of the _conclusion_ follows _necessarily_ from the truth of the _premises_. An _argument form_ is **invalid** if and only if all _premises_ are true and the _conclusion_ is false.

An _argument_ is **valid** if and only if it has a _valid argument form_. Note that an _argument_ being _valid_ does not necessarily mean that the conclusion is _true_. 

How to determine argument validity:

1. Identify the _premises_ and the _conclusion_
2. Construct a _truth table_ with a column for each premise/conclusion
3. Examine all _critical rows*_
   * If the _conclusion_ is _true_ in **every** _critical row_, then the argument form is **valid**
   * If the _conclusion_ is _false_ in **any** _critical row_, then the argument form is **invalid**
      
*_A **critical row** is one where every premise-column is true_

#BoardQuestion _Determine the validity of the following argument:_
“If today is Wednesday, then we have Discrete Math class. Today is not Wednesday. Therefore, we do not have Discrete Math class.”

#KnowledgeCheck _Is the following argument valid or invalid:_
* **9+10 equals 19 OR 9+10 equals 21** _(premise)_
* **9+10 does not equal 19** _(premise)_
* **Therefore, 9+10 equals 21** _(conclusion)_
_hint: think carefully about how validity is defined. Start by converting to the argument form_

#DiscussionQuestion Imagine that you are presented with a _valid argument_ with a _conclusion_ that you feel is _false_. Is it still possible that you are correct?

#Definition An _argument_ is **sound** if and only if the _argument form_ is _valid_ and all of the _premises_ are _true_.

