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

#Definition An _argument_ is **sound** if and only if the _argument form_ is _valid_ and all of the _premises_ are _true_.

---
# Rules of Inference

Some _argument forms_ are very common. It’s helpful to memorize and recognize these common forms to quickly determine the _validity_ of an argument.

#Definition An argument consisting of two _premises_ and a _conclusion_ is known as a **syllogism**. The first premise is the **major premise** and the second premise is the **minor premise**

All of the _argument forms_ below are known to be valid

### Modus Ponens
```latex
p \rightarrow q\\
p\\
\therefore q
```

_example:_
* If geese are coming towards me, then I must flee
* Geese are coming towards me
* Therefore, I must flee

### Modus Tollens
```latex
p \rightarrow q\\
\sim q\\
\therefore \sim p
```

_example:_
* If my dog is awake, then he will bark when I come home
* My dog did not bark when I came home
* Therefore, my dog is not awake 

**Generalization**
```latex
p\\
\therefore p \lor q
```

```latex
q\\
\therefore p \lor q
```


**Specialization**
```latex
p \land q\\
\therefore p
```

```latex
p \land q\\
\therefore q
```

**Conjunction**
```latex
p\\
q\\
\therefore p \land q
```


**Elimination**
```latex
p \lor q\\
\sim q\\
\therefore p
```

```latex
p \lor q\\
\sim p\\
\therefore q
```

**Transitivity**
```latex
p \rightarrow q\\
q \rightarrow r\\
\therefore p \rightarrow r
```

_example:_
* If you don’t study logic, then you will commit fallacies
* If you commit fallacies, then you will look silly
* Therefore, if you don’t study logic, you will look silly!

**Division into Cases**
```latex
p \lor q\\
p \rightarrow r\\
q \rightarrow r\\
\therefore r
```

_example:_
* John did all his homework or John studied his notes
* If John does all his homework, he will pass the exam
* If John studies his notes, he will pass the exam
* Therefore, John will pass the exam

## Contradiction Rule

#Theorem According to the **contradiction rule**: If you show that the supposition that a statement **p** is _false_ leads to a _logical contradiction_, then you can conclude that **p** is _true_ 

```latex
\sim p \rightarrow c\\
\therefore p
```

The same rule applies if supposing **p** is _true_ leads to a _logical contradiction_. You can conclude that **p** is _false_

```latex
p \rightarrow c\\
\therefore \sim p
```

**Identifying a Contradiction**

_Recall:_ A _statement form_ is a _contradiction_ if it is always false regardless of what is substituted for each statement variable.

#DiscussionQuestion Take the statement form: **r ^ (~r ^ s)** , is this a _contradiction_?

| r | s | ~r ^ s | r ^ (~r ^ s) |
|----------|----------|----------|----------|
| T | T | F | F |
| T | F | F | F |
| F | T | T | F |
| F | F | F | F |


_example:_ **[Knights & Knaves](https://philosophy.hku.hk/think/logic/knights.php)**. On a distant island, everyone is either a knight or a knave (but not both). _Knights_ only make _true statements_. _Knaves_ only make _false statements_

#KnowledgeCheck Two natives, **A** and **B**, approach from the island and make the following statements:
* _A claims: “B is a knight”_
* _B claims: “A and I are of opposite type”_
Is **A** a knight or a knave? Is **B** a knight or a knave?
_hint: try applying the contradiction rule_
