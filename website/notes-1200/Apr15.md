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


# Combinations

Recall the definition of _r-permutations_. A similar concept is given for problems in which order is not considered

#Definition An **r-combination** of a set with **n** elements is an (unordered) subset of the set with **r** elements. The number of _r-combinations_ of a set of **n** elements is denoted **C(n,r)** and read as **“n choose r”**

#Theorem If **n** and **r** are integers such that **1 <= r <= n**, then **C(n,r)** is given by the formula:
```latex
C(n,r) = \frac{\text{\# of r-permutations}}{\text{\# of ways to order r elements}} = \frac{\frac{n!}{(n-r)!}}{r!} = \frac{n!}{r!(n-r)!}
```

_Note: C(n,r) is also denoted_
```latex
C(n,r) = {n \choose r}
```

Another convenient interpretation of **C(n,r)** is that it is the number of unique r-element _subsets_ of a set with **n** elements

_example:_

Suppose that 12 children are playing four-square during recess (a game that requires exactly 4 players). How many different games could be played (with a unique selection of players)?

If there are no further restrictions, number of unique games is given by 
```latex
{12 \choose 4} = \frac{12!}{4!(12-4)!} = 495
```

#DiscussionQuestion How would this change if two of the twelve students insisted on playing together (they either both play or neither plays)? How many games could be formed then?

#DiscussionQuestion What if instead two students refused to play together (but would still play with other students or not at all)? How could we count the number of possible games?

# Indistinguishable Objects

#Theorem Suppose there is a collection of **n** objects. These elements are divided into **k** types, where elements of the same type are indistinguishable from each other. Then the number of distinguishable permutations is given by the following expression:
```latex
n_1 := \text{ number of type-1 objects}\\
n_2 := \text{ number of type-2 objects}\\
...\\
n_k := \text{ number of type-k objects}\\
\text{Number of distinguishable permutations} = {n \choose n_1}{n-n_1 \choose n_2}{n-n_1-n_2 \choose n_3}...{n-n_1-...-n_{k-1} \choose n_k}\\
= \frac{n!}{n_1!n_2!n_3!...n_k!}
```

_example:_ **Anagrams of MISSISSIPPI**

How many unique ways could we order the letters of **MISSISSIPPI**? For this we consider each letter of the word as a type.

* **Type-M:** one element
* **Type-I:** four elements
* **Type-S:** four elements
* **Type-P:** two elements

Now applying the theorem above we get:
```latex
{11 \choose 1}{11 - 1 \choose 4}{11 - 1 - 4 \choose 4}{11 - 1 - 4 - 4 \choose 2} = {11 \choose 1}{10 \choose 4}{6 \choose 4}{2 \choose 2}
= \frac{11!}{1!4!4!2!} = \frac{11(10)(9)(8)(7)(6)(5)}{4!2!} = 34650
```


# Selection with Replacement

The selections made when considering _permutations_ and _combinations_ are under the assumption that each element of the set can be selected only once. If the event being modeled allows for repeated elements, then we can consider selecting elements from a set with replacement

#Theorem The number of _r-permutations_ (ordered selections) from a set of **n** elements with replacement is **n^r**

To understand the above theorem, consider a random process in which you select each of the **r** elements individually

Clearly, the number of ways to perform the first selection is **n**. Furthermore, because the element is replaced before selecting the next, there is again **n** options for the second.

Thus, by the multiplication rule, the number of unique permutations is
```latex
n \times n \times ... \times n = \prod_{i=1}^r n = n^r
```


Combinations with replacement can be challenging, as when elements of the selection can be indistinguishable and order does not matter many possible selections are in fact the same and should only be counted once.

_example:_
When counting the _3-combinations_ of **{1,2,3,4}**, the selection **{1,1,2,3}** is the same as **{2,1,3,1}** 

You could enumerate all possibilities by selecting elements in a regular pattern:

* {1,1,1} {1,1,2} {1,1,3} {1,1,4}
* {1,2,2} {1,2,3} {1,2,4}
* ...
* {3,3,3} {3,3,4}
* {3,4,4}
* {4,4,4}

But this quickly becomes tedious and intractable for large sets

One way of interpreting combinations with replacement is to consider a **category representation**

* Consider each element from your set as a _category_
* Create a table with columns for each category
* In each row of the table, place **r** _x’s_ to represent selecting an element from that category

Every row of the table therefore represents a valid _r-combination_ with replacement

| Category 1 | Category 2 | Category 3 | Category 4 |
|----------|----------|----------|----------|
| X | X | X |  |
|  | XX |  | X |
|  |  | XXX |  |
| ... | ... | ... | ... |

The first row, for example, could be written individually as:
  **X | X | X |**
And represents the selection
  **{1, 2, 3}**

The second:
  **| XX | | X**
Represents the selection
  **{2,2,4}**

Now we can consider how many such strings of three (_r_) **X** and three (_n - 1_) **|** can be constructed.

For this, we need only consider of ways to select the positions of the **X**‘s as the **|**‘s will always occupy the remaining positions. This leads us to the theorem below:

#Theorem The number of _r-combinations_ (unordered selections) from a set of **n** elements with replacement is 
```latex
{r+n-1 \choose r}
```

The total number of positions in our string is:
  **number of X + number of |** = **r + (n-1)**

And we need to reserve **r** of them for the **X**. Thus, the total number of selections is **r + n - 1 Choose r**

_example:_ 

The Queen of a distant kingdom has organized a tournament for her ten best knights. The tournament consists of four rounds where all ten knights compete in tests of strength, courage, wit, and chivalry.

A prize of gold coins will be distributed amongst the knights based on the number of rounds that they win.

If each round awards the same percentage of the prize and a knight is able to win multiple rounds, how many different ways could the prizes be awarded?

**Model as r-combination** (_with replacement_)

* **S** - Set of all knights (10 elements/categories)
* Select **r = 4** elements of **S** (_with replacement, order doesn’t matter_)

**Number of ways:**
```latex
{4 + 10 - 1 \choose 4} = {13 \choose 4} = \frac{13!}{4!(13-4)!} = \frac{13!}{4!9!} = \frac{13(12)(11)(10)}{4(3)(2)(1)} = 715
```

There are 715 unique ways the prizes can be awarded

# Graphs

A _graph_ consists of two sets:
* A **Vertex Set** (**V**) containing **Vertices/Nodes**
* An **Edge Set** (**E**) relating elements of **V**

![](../img/simple-graph.png)
Each **edge** in **E** is associated with two vertices from **V** called **endpoints**

For example, the _edge set_ for the graph above is: 
**{ {1,2}, {1,5}, {2,3}, {2,5}, {3,4}, {4,5}, {4,6} }**

_terminology:_

* Any two _vertices_ that are joined by an _edge_ are said to be **adjacent**
* Edges that share the same endpoints are called **parallel edges**
* An edge of the form _{v, v}_ where _v_ is some vertex is called a **loop**
* A Vertex that is not part of any edges is known as a **isolated vertex**
