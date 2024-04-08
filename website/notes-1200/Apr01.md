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

In this section we will discuss _randomness_, the _likelihood_ of particular _events_, and the art of ... _counting_  


# Counting

From the exercises above, we can see that computing probabilities often relies on knowing the number of elements in various sets representing _sample spaces_ and _events_.

In some cases, counting the number of elements in a set is trivial. Other times, when the set is very large, the task is not so easy. The field of _combinatorics_ applies mathematical principles to count and arrange sets that would otherwise be infeasible to compute by hand


#DiscussionQuestion Consider the C++ code below

```c++
int count-elements(int n, int m)
{
// Count integers between n and m (inclusive)

  int total = 0; 

  for(int i = n; i <= m; i++)
    total = total + 1;
}
```

Can we calculate the result of **count-elements(n,m)** without looping?

## Helpful Counting Theorems

When looking at repeated random experiments or random processes with multiple steps, computing probabilities will often require counting the number of possible combinations of outcomes or decisions

#Definition Two events are **independent** if and only if the outcome of one event has no effect on the outcome of the other

#Theorem (_The Multiplication Rule_): Consider a process which consists of _k_ _independent_ steps.
```latex
\text{Let }n_1\text{ represent the number of ways to perform step }1\\
\text{Let }n_2\text{ represent the number of ways to perform step }2\\
...\\
\text{Let }n_k\text{ represent the number of ways to perform step }k\\
\text{Then the number of ways to perform the whole process is }n_1n_2...n_k
```

---
_example:_ **Guessing Passwords**

Suppose you want to know the probability of randomly guessing an 8-digit password which can contain the characters {0-9,a-z,A-Z} and has no other restrictions

If we suppose that every password is equally likely, and that whatever guess we make is also uniform random, then it suffices to know what is the total number of possible 8-digit passwords

Model the process of creating a password as an operation involving 8 independent steps, one for selecting each character

**Number of ways to select the first character:**

  There are 10 numerical digits, 26 lowercase letters, and 26 uppercase letters which gives us a total of **62** options

Because there are no further restrictions, we can reason that there are the same number of options for the remaining 7 characters.

Therefore, _by the multiplication rule_, the number of ways to generate a unique password is 
  **62(62)(62)(62)(62)(62)(62)(62) = 218,340,105,584,896**

Consider this as the size of our _sample space_. The size of the _event_ “the generated password matches the first guess exactly” is 1

The probability of guessing a randomly generated password is then:
```latex
P(\text{correct guess}) = \frac{1}{218340105584896} \approx 0.00000000000000458
```

#DiscussionQuestion How might this probabilistic model of password-guessing differ from a real-world scenario? Is there anything an attacker could exploit to improve their odds of guessing correctly? Is there anything a user can do to decrease the odds of their password being guessed?

---
_example:_ **Anagrams**

Let us suppose a different scenario where a theoretical attacker has physical access to your computer (which is password-protected) and makes a keen observation that some keys on your keyboard are significantly more worn than others.

![](../img/worn-keyboard.jpg)

The attacker makes the assumption that your password likely consists of these characters. Furthermore, because no one key is more worn than the rest, they reason that there are no repeated characters. ==Each of the 8 slightly-faded characters appears exactly once.==

In this scenario, how likely is the attacker to guess your password? In other words, how many passwords could you create using exactly those 8 characters?

To model this problem, let us again consider selecting a character of the password as one step in a multi-stage process.

**Ways to select the first character:** 8
**Ways to select the second character:** 7
**...**
**Ways to select the eighth character:** 1

_Using the multiplication rule_
**Total number of possible passwords:** 8(7)(6)(5)(4)(3)(2)(1) = 40,320

---

#Definition A **permutation** of a finite set is a _total ordering_ of the elements

#Theorem The number of permutations of a set with **n** elements is **n(n-1)...(2)(1) = n!**

#Definition An **r-permutation** of a set with **n** elements is an ordered selection of **r** elements taken from the set (without replacement). The number of _r-permutations_ of a set of **n** elements is denoted **P(n,r)**

#Theorem If **n** and **r** are integers such that **1 <= r <= n**, then the total number of _r-permutations_ of a set of **n** elements is given by the formula:
```latex
P(n,r) = n(n-1)(n-2)...(n-r+1) = \frac{n!}{(n-r)!}
```
