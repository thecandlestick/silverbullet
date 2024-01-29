---
tags: template
trigger: "argument-validity"
---

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

_example:_ **[Knights & Knaves](https://philosophy.hku.hk/think/logic/knights.php)**. On a distant island, everyone is either a knight or a knave (but not both). _Knights_ only make _true statements_. _Knaves_ only make _false statements_

#DiscussionQuestion Two natives, **A** and **B**, approach from the island and make the following statements:
* _A claims: “B is a knight”_
* _B claims: “A and I are of opposite type”_
Is A a knight or a knave? Is B a knight or a knave?

## Arguments from Quantified Statements

The law of **Universal Instantiation** says that if some property is true of _everything_ in a set, then it is true of _any particular_ thing in the set. This concept can be combined with other _rules of inference_ to create new _valid argument forms_.

**Universal Modus Ponens**
```latex
\forall x \in D, P(x) \rightarrow Q(x)\\
a \in D \land P(a)\\
\therefore Q(a)
```

**Universal Modus Tollens**
```latex
\forall x \in D, P(x) \rightarrow Q(x)\\
a \in D \land \sim Q(a)\\
\therefore \sim P(a)
```

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

_other common fallacies to watch out for include:_
* **Ambiguous Premises**
When an ambiguous statement is used as a premise without clarification

* **Circular Reasoning**
When the conclusion being argued is the same as one of the premises. While this mistake can produce a valid argument, it relies on the assumption that the _conclusion_ is true to prove that the conclusion is true!

* **Jumping to a Conclusion**
When the conclusion isn’t properly justified via the use of truth tables or known rules of inference.


# Argument Diagrams

An alternative method of determining the validity of arguments is by constructing an **argument diagram**. In this method, circles are drawn to represent _sets_ and points are drawn to represent _individual elements_. Doing so can help visualize why an argument is _valid_ or help identify a _counterexample_ that suggests an argument is _invalid_

#BoardQuestion Construct an _argument diagram_ for the argument below:
```latex
\forall x \in \R, x \in \Z \rightarrow x \in \mathbb{Q}\\
y \in \Z\\
\therefore y \in \mathbb{Q}
```


