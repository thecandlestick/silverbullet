---
tags: template
hooks.snippet.slashCommand: "propositional-logic"
---

# Propositional Logic

#Definition A **proposition** (or **statement**) is a sentence that is either _true_ or _false_ but not both

For example:
* **2 + 2 = 5**  despite being _false_, is still a _proposition_
* **x / 2 > 0**  could be _true_ or _false_ depending on x, so it is not a _proposition_

To express more complex ideas, these propositions can be combined into **compound propositions**

Propositions can also be **negated** using the symbols ~, ¬, or !

When working with compound propositions, it is common to replace each proposition with a **statement variable** to create the **statement form**

Types of compound propositions:
* **Conjunction:** p ^ q, where p and q are propositions
  * Read as “p and q”
  * Both p and q must be true for p ^ q to be true
  * _example:_ “Mt. Kilimanjaro is taller than Mt. Fuji _and_ Mt. Everest is taller than Mt. Kilimanjaro”
    
* **Disjunction:** p v q, where p and q are propositions
  * Read as “p or q”
  * Either p or q must be true for p v q to be true
  * _example:_ “zero is not positive _or_ zero is not negative”

#DiscussionQuestion The disjunction defined above is for an an _inclusive or_ statement (both p and q can be true). An _exclusive or_ statement, written **p ⊕ q**, is one that is true when p is true or q is true but not both. Can the _exclusive or_ be defined in terms of conjunctions and disjunctions?

---

## Truth Tables

The **truth table** for a given _statement form_ displays the truth values that correspond to all possible combinations of truth values for its statement variables.

_truth table for conjunction_
| p | q | p ^ q |
|----------|----------|----------|
| T | T | T |
| T | F | F |
| F | T | F |
| F | F | F |

_truth table for disjunction_
| p | q | p v q |
|----------|----------|----------|
| T | T | T |
| T | F | T |
| F | T | T |
| F | F | F |

### Logical Equivalence

#Definition Two statement forms are **logically equivalent** if and only if the outputs of their _truth tables_ are the same for every combination of inputs. **w ≡ v**, where w and v are statement forms, is a statement meaning “w is logically equivalent to v”

_Example:_ the statement **(p ^ q) ^ r ≡ p ^ (q ^ r)** can be proved using a truth table
| p | q | r | p ^ q | q ^ r | (p ^ q) ^ r | p ^ (q ^ r) |
|----------|----------|----------|----------|----------|----------|----------|
| T | T | T | T | T | T | T |
| T | T | F | T | F | F | F |
| T | F | T | F | F | F | F |
| T | F | F | F | F | F | F |
| F | T | T | F | T | F | F | 
| F | T | F | F | F | F | F |
| F | F | T | F | F | F | F |
| F | F | F | F | F | F | F |

#KnowledgeCheck True or False: **p ^ (p v q) ≡ p**
_hint: use a truth table if you’re unsure_

### Special Statement Forms

#Definition A **Tautology** is a statement form that is always _true_ regardless of the truth values of its _statement variables_

#Definition A **Contradiction** is a statement form that is always _false_ regardless of the truth values of its _statement variables_

---
 
## Conditional Statements

**conditional statements** relate the truth value of one proposition to the truth value of another

Written as **p -> q** for statement variables p and q, this proposition means “if p then q” or “p implies q”

In the statement form above, p is the **hypothesis** or **antecedent**.
q is the **conclusion** or **consequent**

_truth table for conditional_
| p | q | p -> q |
|----------|----------|----------|
| T | T | T |
| T | F | F |
| F | T | T |
| F | F | T |

Notice in the truth table above that a conditional is only false when the _hypothesis_ is true and the _conclusion_ is false. If the hypothesis of a conditional is false, then the statement is said to be **vacuously true** or “true by default”

_Example:_ the statement “if 0 = 1, then rocks are vegetables” is considered a true statement by the rules of propositional logic

A **biconditional** statement has the form **p <-> q** for statement variables p and q, and is interpreted as “p if and only if q” (often abbreviated as “p iff q”)

_truth table for biconditional_
| p | q | p <-> q |
|----------|----------|----------|
| T | T | T |
| T | F | F |
| F | T | F |
| F | F | T |

It is important to note that the conditional operators (**->, <->**) are typically applied _last_ when evaluating propositions

_operator precedence:_
* **~** negation
* **^ , v** conjunction/disjunction 
* **->, <->** conditional/biconditional

#BoardQuestion Verify that the following statement is _true_: **p v q -> r ≡ (p -> r) ^ (q -> r)**

### Special Conditional Forms

#Definition The **converse** of a conditional **p -> q** is **q -> p**

#Definition The **inverse** of a conditional **p -> q** is **~p -> ~q**

#Definition The **contrapositive** of a conditional **p -> q** is **~q -> ~p**

#DiscussionQuestion Are these forms _logically equivalent_ to the conditional **p -> q**? What is your intuition? How would you confirm if your answer is correct or not?

### Necessary & Sufficient Conditions

Another way to relate two propositions is to identify one as a **sufficient** and/or **necessary** condition for the other.

#Definition The statement: “r is a _sufficient_ condition for s”
means “if r, then s”, or **r -> s**

#Definition The statement: “r is a _necessary_ condition for s”
means “if not r, then not s”, or **~r -> ~s**

#Definition The statement: “r is a _necessary & sufficient_ condition for s” means “r if and only if s”, or **r <-> s**

---

## Negating Propositions

#Theorem **DeMorgan’s Laws**: The negation of a _conjunction_ is logically equivalent to the corresponding _disjunction_ in which each component is negated. The negation of a _disjunction_ is logically equivalent to the corresponding _conjunction_ in which each component is negated.

This theorem tells us that **~(p v q)** is logically equivalent to **~p ^ ~q**
and **~(p ^ q)** is logically equivalent to **~p v ~q**.

We can confirm both of these results using a truth table:

| p | q | p v q | ~(p v q) | ~p ^ ~q |
|----------|----------|----------|----------|----------|
| T | T | T | F | F |
| T | F | T | F | F |
| F | T | T | F | F |
| F | F | F | T | T |

Therefore, **~(p v q)** ≡ **~p ^ ~q**

| p | q | p ^ q | ~(p ^ q) | ~p v ~q |
|----------|----------|----------|----------|----------|
| T | T | T | F | F |
| T | F | F | T | T |
| F | T | F | T | T |
| F | F | F | T | T |

Therefore, **~(p ^ q)** ≡ **~p v ~q**

Sometimes it becomes necessary to apply DeMorgan’s laws multiple times during a negation as in the example below

#BoardQuestion Using DeMorgan’s law, negate the statement form:        **(~p ^ q) ^ (p v q)**


### Negating conditional statements

Recall that a conditional statement **p -> q** is _false_ if and only if p is _true_ and q is _false_. The negation **~(p -> q)** should therefore be _true_ if and only if p is _true_ and q is _false_. A statement form with this property can be written as **p ^ ~q**

and confirmed with a truth table:

| p | q | p -> q | ~(p -> q) | p ^ ~q |
|----------|----------|----------|----------|----------|
| T | T | T | F | F |
| T | F | F | T | T |
| F | T | T | F | F |
| F | F | T | F | F |

Therefore, **~(p -> q)** ≡ **p ^ ~q**

---

