#cs1575LN
|  |  |  |  |
|----------|----------|----------|----------|
| [[CS1575|Home]] | [[CS1575 Calendar|Calendar]] | [[CS1575 Syllabus|Syllabus]] | [[Lecture Notes]] |


## Reminders

```query
cs1575task
where done = false
render [[template/task]]
```

## Objectives

```query
task
where page = "CS1575 Calendar" and done = false
limit 3
order by pos
render [[template/topic]]
```
---

# Default Member Functions

## Destructor
[[examples/linkedlist-destructor]]



Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%20%20%20%20ListNode%28int%20data%29%20%7B%20m_next%20%3D%20nullptr%3B%20m_data%20%3D%20data%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20~LinkedList%28%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20//%20SKIP%20TO%20%20step%20~20%20for%20destructor%0A%20%20mylist.m_size%20%3D%202%3B%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.m_head%20%3D%20new%20ListNode%285%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20%3D%20new%20ListNode%2810%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20-%3E%20m_next%20%3D%20p%3B%0A%0A%20%20return%200%3B%0A%7D%0A%0ALinkedList%3A%3A~LinkedList%28%29%0A%7B%0A%20%20ListNode%20*tmp%3B%0A%20%20tmp%20%3D%20m_head%20-%3E%20m_next%3B%0A%20%20while%20%28%20tmp%20!%3D%20nullptr%20%29%0A%20%20%7B%0A%20%20%20%20delete%20m_head%3B%0A%20%20%20%20m_head%20%3D%20tmp%3B%0A%20%20%20%20tmp%20%3D%20m_head%20-%3E%20m_next%3B%0A%20%20%7D%0A%20%20delete%20m_head%3B%0A%7D&cumulative=false&curInstr=19&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation
(the _tmp_ ptr is not visible, but you can follow its value yourself)

## Operator=
[[examples/linkedlist-assign-op]]


Step through a [visualization](https://pythontutor.com/visualize.html#code=class%20ListNode%0A%7B%0A%20%20public%3A%0A%20%20%20%20int%20m_data%3B%20%20//%20single%20data%20item%0A%20%20%20%20ListNode%20*m_next%3B%20%20//%20ptr%20to%20next%20node%0A%20%20%20%20ListNode%28%29%20%7B%20m_next%20%3D%20nullptr%3B%20%7D%0A%20%20%20%20ListNode%28int%20data%29%20%7B%20m_next%20%3D%20nullptr%3B%20m_data%20%3D%20data%3B%20%7D%0A%7D%3B%0A%0A%0Aclass%20LinkedList%0A%7B%0A%20%20public%3A%0A%20%20%20%20ListNode%20*m_head%3B%20%20//%20ptr%20to%20first%20node%0A%20%20%20%20int%20m_size%3B%0A%20%20%20%20LinkedList%28%29%0A%20%20%20%7B%0A%20%20%20%20m_head%20%3D%20new%20ListNode%3B%20//invokes%20default%20constructor%0A%20%20%20%20m_size%20%3D%200%3B%0A%20%20%20%7D%0A%20%20%20void%20insert%28ListNode%20*p,%20const%20int%26%20x%29%3B%0A%20%20%20const%20LinkedList%26%20operator%3D%28%20const%20LinkedList%20%26rhs%20%29%3B%0A%7D%3B%0A%0Aint%20main%28%29%20%7B%0A%0A%20%20LinkedList%20mylist%3B%20//%20SKIP%20TO%20%20step%20~20%20for%20destructor%0A%20%20mylist.m_size%20%3D%202%3B%0A%0A%20%20ListNode%20*p%20%3D%20mylist.m_head%3B%0A%20%20mylist.m_head%20%3D%20new%20ListNode%283%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20%3D%20new%20ListNode%287%29%3B%0A%20%20mylist.m_head%20-%3E%20m_next%20-%3E%20m_next%20%3D%20p%3B%0A%0A%20%20LinkedList%20myotherlist%3B%0A%20%20myotherlist%20%3D%20mylist%3B%0A%0A%20%20return%200%3B%0A%7D%0A%0Aconst%20LinkedList%26%20LinkedList%3A%3Aoperator%3D%28%20const%20LinkedList%20%26rhs%20%29%0A%7B%0A%20%20//%20clear%28%29%3B%20//start%20by%20emptying%20list%20%28excluded%20from%20viz%29%0A%20%20ListNode*%20p%20%3D%20m_head%3B%0A%20%20ListNode*%20q%20%3D%20rhs.m_head%3B%0A%20%20while%20%28%20q%20-%3E%20m_next%20!%3D%20nullptr%20%29%20//use%20two%20pointers%20to%20deep%20copy%0A%20%20%7B%0A%20%20%20%20insert%28p,%20q%20-%3E%20m_data%29%3B%0A%20%20%20%20p%20%3D%20p%20-%3E%20m_next%3B%0A%20%20%20%20q%20%3D%20q%20-%3E%20m_next%3B%0A%20%20%7D%0A%20%20%0A%20%20return%20*this%3B%0A%7D%0A%0Avoid%20LinkedList%3A%3Ainsert%28ListNode%20*p,%20const%20int%26%20x%29%0A%7B%0A%20%20ListNode%20*tmp%20%3D%20new%20ListNode%3B%0A%20%20tmp%20-%3E%20m_data%20%3D%20p%20-%3E%20m_data%3B%0A%20%20tmp%20-%3E%20m_next%20%3D%20p%20-%3E%20m_next%3B%0A%20%20p%20-%3E%20m_data%20%3D%20x%3B%0A%20%20p%20-%3E%20m_next%20%3D%20tmp%3B%0A%20%20m_size%2B%2B%3B%0A%7D&cumulative=false&curInstr=0&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=cpp_g%2B%2B9.3.0&rawInputLstJSON=%5B%5D&textReferences=false) of this operation
(you may want to make use of the _move and hide objects_ button)

## Copy Constructor
[[examples/linkedlist-copy-constructor]]


# Intro to Algorithm Complexity

## Motivation

Consider the following scenario: 
You have access to two algorithms, Algo A and Algo B.

Algo A and Algo B both produce identical outputs from identical inputs, and they are both always correct. How then can we compare these algorithms? Does it matter which one we choose?

#DiscussionQuestion What differs between Algo A and Algo B?
* Speed?
* Memory Consumption?
* Security
* Maintainabilty
* Scalability

We need an objective way to take these characteristics and decide which algorithm is the _better method_ for our purposes.

---
## Empirical vs. Analytical Testing

Let’s focus on speed (or _time complexity_), but these techniques can be applied to practically anything.

One approach that we could take is **empirical testing**, in terms of speed this could entail literally running the two algorithms and timing how long they take to complete. ⏱️

#DiscussionQuestion In order to make this a fair and objective comparison, what factors would you need to hold constant?

Some of these things aren’t so easy to ensure, and empirical testing in general is prone to producing biased results. **Analytical testing** gives us an often more useful method of ranking the two algorithms with mathematical certainty. To do so, we first need to convert the algorithms into functions representing their performance.

---
## Runtime Functions

A **runtime function** is a function that, given the size of an input, approximates the number of _operations_ an algorithm will take to produce the output.

By operations, we mean any sufficiently small procedure that performs a single logical step in the execution. We make this definition to simply the math and to prevent loss of generality between different compilers, processor architectures, etc.
(_examples: + - / * % [] || && < > = == ..._)

For instance, we may have the following runtime functions for Algo A and Algo B:

```latex
  T_a(n) = 3n^2 + 6 \\
  T_b(n) = 0.05n^3 + 2
```
Measuring the number of operations where _n_ is the size of the input.

_size of input_ in this context can represent several things. What we really mean by it is anything that affects the number of operations required. This is can refer things such as the amount of data currently contained in a data structure or the number of bits in an integer input, for instance. Another consideration is that _size_ of input is not the only factor affecting runtime, two inputs of the same size can give drastically different results.


It’s for this reason that we typically disregard the _best-case scenario_ for inputs in favor of an _average-case_ or _worst-case_.

[[examples/runtime-basics]]

[[examples/runtime-branching]]

[[examples/runtime-looping]]

[[examples/runtime-logarithm]]

If you want to analyze other characteristics, you just need to come up with an equivalent function representation. For example, a function that maps _size of input_ to _bytes of memory_ needed to produce the output would allow you to analyze memory consumption (or _space complexity_)

