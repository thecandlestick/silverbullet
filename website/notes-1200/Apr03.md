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

## Permutations

#Definition A **permutation** of a finite set is a _total ordering_ of the elements

#Theorem The number of permutations of a set with **n** elements is **n(n-1)...(2)(1) = n!**

#Definition An **r-permutation** of a set with **n** elements is an ordered selection of **r** elements taken from the set (without replacement). The number of _r-permutations_ of a set of **n** elements is denoted **P(n,r)**

#Theorem If **n** and **r** are integers such that **1 <= r <= n**, then the total number of _r-permutations_ of a set of **n** elements is given by the formula:
```latex
P(n,r) = n(n-1)(n-2)...(n-r+1) = \frac{n!}{(n-r)!}
```

---
_example:_ **non-repeating passwords**

Consider adding the restriction that passwords cannot contain duplicate characters. With only this restriction, how many 8-character passwords can we create?

We could model this from scratch, or we could observe that generating a valid password this way is the same as selecting 8 valid but unique characters and putting them in a specific order.

The total number of non-repeating passwords is therefore the same as the number of _8-permutations_ of a set with _62_ elements or **P(62,8)**
```latex
P(62,8) = \frac{62!}{(62-8)!} = \frac{62!}{54!}
```

**62!** and **54!** are too big to calculate directly (conveniently), but we can cancel some terms to simplify
```latex
\frac{62!}{54!} = \frac{62(61)...(54)(53)...(2)(1)}{54(53)...(2)(1)}
= \frac{62(61)...\cancel{(54)(53)...(2)(1)}}{\cancel{54(53)...(2)(1)}}
= \frac{62(61)(60)(59)(58)(57)(56)(55)}{1}
```
This gives us a total of **136,325,893,334,400** possible non-repeating passwords

---

#Theorem (_The Addition Rule_): Suppose finite set **A** is the union of **k** mutually disjoint subsets
```latex
A = A_1 \cup A_2 \cup ... \cup A_k
```
Then the number of elements in **A** is the sum of the number of elements in each subset
```latex
|A| = |A_1| + |A_2| + ... + |A_k|
```

---
_example:_ **variable-length passwords**

Suppose that we allow a password to range from 4-8 characters. How does this change the total number of possible passwords?

We can apply the _addition rule_ to figure this out. Consider the following sets:
* **P** - The set of all passwords
* **A** - The set of all 8-character passwords
* **B** - The set of all 7-character passwords
* **C** - The set of all 6-character passwords
* **D** - The set of all 5-character passwords
* **E** - The set of all 4-character passwords 

Clearly,
```latex
P = A \cup B \cup C \cup D \cup E
```
Thus, to figure out **|P|** we first need to calculate

* **|A|** = 218,340,105,584,896 = 62^8
* **|B|** = 62^7 = 3,521,614,606,208
* **|C|** = 62^6
* **|D|** = 62^5
* **|E|** = 62^4

Therefore, the total number of possible passwords is 
**|P|** = 62^8 + 62^7 + .. + 62^4

---

#Theorem (_The Difference Rule_): Suppose set **B** is a subset of a finite set **A**, then
```latex
|A-B| = |A| - |B|
```

---
_example:_ **non-dictionary passwords**

A common tactic for attackers is to not guess a password randomly, but instead focus on guessing passwords that spell out English words. The reasoning is that these passwords are much easier to remember for the users and thus more likely to be chosen

Suppose that we add a restriction to our 8-character passwords that they cannot be words found in the dictionary. For reference, the official Scrabble® Dictionary contains **80148** 8-letter words. In this case, how many valid passwords can we generate?

**A** - The set of all 8-character passwords
**B** - The set of all 8-letter English words

Suppose that **B** is a subset of **A** (ignore the possibility of words with non-alphanumeric characters)

**|A|** = 218,340,105,584,896
**|B|** = 80148

Therefore, by the _difference rule_, the total number of valid passwords is **|A| - |B|** = 218,340,105,504,748

---
## Probability of Complements

#Theorem If **S** is a finite _sample space_ and **E** is an event in **S**, then
```latex
P(E^c) = 1 - P(E)
```

In other words, the probability that a particular event _does not_ happen is equal to one minus the probability that it _does_ happen.

---
_example:_ **stronger passwords**

Let us suppose that a strong 8-character password is one that:
* contains at least one uppercase letter
* contains at least one lowercase letter
* contains at least one number
* every character is unique 

What is the probability that a uniform randomly generated password will not satisfy these requirements?

Let **S** = the set of all possible passwords (consisting of 0-9,a-z,A-Z)
Let **V** = the set of all passwords satisfying the requirements
Let **I** = the set of all passwords not satisfying the requirements

We want to know **P(I)**, but because **I** is the _complement_ of **V**, we can instead work on calculating **P(V)**

To figure out **|V|**, we need to count the number of passwords that meet our restrictions. Let us model this as a random process

* **Step 1:** Select the characters used in the password
* **Step 2:** Select the order of the characters

In **step 1**, we need to ensure that the characters selected include something from {0-9}, {a-z}, and {A-Z}. Let us break this step down even further.

* **Step 1:** Select the characters used in the password
  * **Step 1a:** Select a character from {0-9}
  * **Step 1b:** Select a character from {a-z}
  * **Step 1c:** Select a character from {A-Z}
  * **Step 1d:** Select the remaining 5 characters uniquely
* **Step 2:** Select the order of the characters

This way, **steps 1a-1c** ensure we meet the requirements. Now we can compute our probabilities using the _multiplication rule_

  _N(x) := the number of ways to perform step x_
  **|S|** = 218,340,105,584,896
  **|V|** = N(Step 1) * N(Step 2)
  
  **N(Step 1)** = N(Step 1a) * N(Step 1b) * N(Step 1c) * N(Step 1d)

  * **N(Step 1a)** = 10
  * **N(Step 1b)** = 26
  * **N(Step 1c)** = 26
  * **N(Step 1d)** = (62-3)(58)(57)(56)(55)

  * **N(Step 1)** = 4.06 x 10^12
  
  **N(Step 2)** = number of _permutations_ for a set of 8 = **8!**
  
  Therefore, **|V|** = 8! x 4.06 x 10^12 and **P(V)** = **|V| ➗ |S|**
  
  Finally, **P(I) = 1 - P(V)**

---