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

_example:_ **[Knights & Knaves](https://philosophy.hku.hk/think/logic/knights.php)**. On a distant island, everyone is either a knight or a knave (but not both). _Knights_ only make _true statements_. _Knaves_ only make _false statements_

#KnowledgeCheck Two natives, **A** and **B**, approach from the island and make the following statements:
* _A claims: “B is a knight”_
* _B claims: “A and I are of opposite type”_
Is **A** a knight or a knave? Is **B** a knight or a knave?
_hint: try applying the contradiction rule_

## Arguments from Quantified Statements

The law of **Universal Instantiation** says that if some property is true of _everything_ in a set, then it is true of _any particular_ thing in the set. This concept can be combined with other _rules of inference_ to create new _valid argument forms_.

**Universal Modus Ponens**
```latex
\forall x \in D, P(x) \rightarrow Q(x)\\
a \in D \land P(a)\\
\therefore Q(a)
```

_example:_
* All knights tell the truth
* Arthur is a knight
* Arthur tells the truth

**Universal Modus Tollens**
```latex
\forall x \in D, P(x) \rightarrow Q(x)\\
a \in D \land \sim Q(a)\\
\therefore \sim P(a)
```

_example:_
* All knaves tell only lies
* Lancelot tells the truth
* Lancelot is not a knave
  
# Logical Fallacies

Don’t fall into these common fallacies. The _argument forms_ featured below are ==invalid!==

### Converse Error
```latex
p \rightarrow q\\
q\\
\therefore p
```

This fallacy is also known as _affirming the consequent_

_example:_
* If it’s storming outside, then it’s windy
* It’s windy outside
* Therefore, it’s storming

### Inverse Error
```latex
p \rightarrow q\\
\sim p\\
\therefore \sim q
```

This fallacy is also known as _denying the antecedent_

_example:_
* If interest rates are going up, then stock prices will go down
* Interest rates are not going up
* Therefore, stock prices will not go down

# Argument Diagrams

An alternative method of determining the validity of arguments is by constructing an **argument diagram**. In this method, circles are drawn to represent _sets_ and points are drawn to represent _individual elements_. 

A diagram is drawn for each _premise_, and then they are all combined into a single diagram. If the argument is valid, then any diagram produced this way must illustrate the conclusion. 

Doing so can help visualize why an argument is _valid_ or help identify a _counterexample_ that suggests an argument is _invalid_

#BoardQuestion Construct an _argument diagram_ for the argument(s) below:
```latex
\forall x \in \Z, x \in \mathbb{Q}\\
y \in \Z\\
\therefore y \in \mathbb{Q}
```

* All human beings need oxygen to survive
* Mushrooms need oxygen to survive
* therefore, mushrooms are human beings

# Proofs

A **proof**, put simply, is a carefully reasoned mathematical argument intended to convince the reader of the truth of an assertion.

_At minimum,_ a correct proof must be logically sound and the conclusion unambiguously true.

_In practice,_ authors of proofs will assume some level of mathematical knowledge on the part of the reader and rely primarily on theorems and rules of inference to make the finished proof more succinct.

_Some knowledge that we will assume:_
* Basic Algebra
* Properties of real numbers
* Equality Properties
  * **A = A** | if **A = B** then **B = A** | if **A = B** and **B = C** then **A = C**
* Associativity, Commutativity, etc.
* Integers closed under +/-/x

## Formalizing Properties

#Definition An integer **n** is **even** if and only if **n** is equal to twice some integer. An integer **m** is **odd** if and only if **m** equals twice some integer plus 1

```latex
\text{n is even} \Leftrightarrow \exists k \in \Z \text{ such that } n = 2k
```
```latex
\text{n is odd} \Leftrightarrow \exists k \in \Z \text{ such that } n = 2k + 1
```

#DiscussionQuestion
* Is 0 even?
* Is 21 odd?
* If a, b are integers, is 10a + 8b + 1 odd?
* If n is an even number, is n/2 even?
* If n is an odd number, is 3n+1 even or odd?

#DiscussionQuestion How would you prove or disprove these statements?
* The sum of an even number and an odd number is odd
* The product of two even numbers is even

#Definition A real number **r** is **rational** if and only if it can be expressed as a quotient of two integers with a nonzero denominator.

```latex
\text{r is rational} \Leftrightarrow \exists a, b \in \Z \text{ such that } r = \frac{a}{b} \land b \ne 0
```

#DiscussionQuestion Are the following numbers _rational_?
* 10/3
* 3/10
* 0.1212121212...
* x, where x is an integer
* 320.5492492492492492...

**