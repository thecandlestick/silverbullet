#cs1200LN
|  |  |  |  |
|----------|----------|----------|----------|
| [[CS1200|Home]] | [[CS1200-Calendar|Calendar]] | [[course syllabus|Syllabus]] | [[course lec notes|Lecture Notes]] |


## Reminders

```query
cs1200task
where done = false
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

### Special Conditional Forms

#Definition The **converse** of a conditional **p -> q** is **q -> p**

#Definition The **inverse** of a conditional **p -> q** is **~p -> ~q**

#Definition The **contrapositive** of a conditional **p -> q** is **~q -> ~p**

#DiscussionQuestion Are these forms _logically equivalent_ to the conditional **p -> q**? What is your intuition? How would you confirm if your answer is correct or not?

==contrapositive is logically equivalent. The others are not.==

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

~((~p ^ q) ^ (p v q))

let w = (~p ^ q)
let k = (p v q)

~(w ^ k)
~w v ~k **by demorgan’s law**

~w is (p v ~q) **by demorgan’s law**
~k is (~p ^ ~q) **by demorgan’s law**

FINAL ANS: ==(p v ~q) v (~p ^ ~q)==
| p | q  | (p v ~q) | (p v ~q) v (~p ^ ~q) |
|----------|----------|----------|----------|
| T | T | T | T |
| T | F | T | T |
| F | T | F | F |
| F | F | T | T |

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

