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

Some _argument forms_ are very common. It’s helpful to memorize and recognize these common forms to quickly determine the _validity_ of an argument. All of the _argument forms_ below are known to be valid

Modus Ponens
```latex
p \rightarrow q\\
p\\
\therefore q
```


Modus Tollens
```latex
p \rightarrow q\\
\sim q\\
\therefore \sim p
```


Generalization
```latex
p\\
\therefore p \lor q
```

```latex
q\\
\therefore p \lor q
```


Specialization
```latex
p \land q\\
\therefore p
```

```latex
p \land q\\
\therefore q
```

Conjunction
```latex
p\\
q\\
\therefore p \land q
```


Elimination
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

Transitivity
```latex
p \rightarrow q\\
q \rightarrow r\\
\therefore p \rightarrow r
```


Division into Cases
```latex
p \lor q\\
p \rightarrow r\\
q \rightarrow r\\
\therefore r
```

### Contradiction Rule
```latex
\sim p \rightarrow c\\
\therefore p
```



## Arguments from Quantified Statements

The law of **Universal Instantiation** says that if some property is true of _everything_ in a set, then it is true of _any particular_ thing in the set

Universal Modus Ponens
```latex
\forall x \in D, P(x) \rightarrow Q(x)\\
a \in D \land P(a)\\
\therefore Q(a)
```


Universal Modus Tollens
```latex
\forall x \in D, P(x) \rightarrow Q(x)\\
a \in D \land \sim Q(a)\\
\therefore \sim P(a)
```

# Logical Fallacies

Don’t fall into these common fallacies. The _argument forms_ featured below are ==invalid!==

Converse Error
```latex
p \rightarrow q\\
q\\
\therefore p
```


Inverse Error
```latex
p \rightarrow q\\
\sim p\\
\therefore \sim q
```

