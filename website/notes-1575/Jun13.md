

Date: 2023-06-13
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=4e414b32-af89-4e03-a634-b0200137de5c

Reminders:
* [x] Quiz 0 Due Wednesday

Objectives:
* [x] talk about data structures

---

What is it that computer scientists do?

## Problems and Algorithms and Programs! Oh My!

In order to apply computers to real-world problems, those problems must be _formally represented_. That is, we need strict and precise description of input and output, then the problem to be solved is mapping one to the other. The unambiguous, finite steps we take to do so are what we call an _algorithm_, but the selection of input and output always comes first.

This leads us to a core component of computer science, how we choose to represent a problem can lead to more efficient programs, more accurate (to the real-world) programs, or simply programs that are more maintainable / easy to understand. ==Trade-offs== are everywhere and unavoidable!

What does solving a problem entail?
* Computations (logic)
* ==Storing & Manipulating **Data** <- (the big one)==


# Abstract Data Types

Just as computer scientists decide upon problem representations, we are also tasked with devising ways to take the relevant problem-data and represent it in the computer. 

An **Abstract Data Type** (ADT) is a way of describing the _shape_ and _utility_ of a data representation ==without specifying _how it works_.==

Breaking that down a bit, by _shape_ we essentially mean what the data is (an integer, a continuous value, etc.), or in the case of _collections_ of data, how the individual pieces of data are related to each other. Do they have an order to them? Is that order linear or hierarchical? Does the relationship between them come from the values they store or from the problem we are trying to represent? Luckily for us, these underlying patterns of relationships have been studied by mathematicians long before computers existed. That is why one component of an ADT is a **mathematical object** that best fits the answer to these questions. Examples might include _sequences, sets, trees, graphs, or functions_

By _utility_, we mean what we want to be able to do with that data. Will we need to add more data as the program goes along? What about removing data? Do we need the ability to retrieve data or change the order of it? All of this goes into the **operations** that we define for our ADT. + - / * %

Put another way, an ADT is a **mathematical object** together with its **operations.** Note that these concepts have ==nothing to do with code,== the underlying details of how we store the data and make the operations function is completely programming-language-dependent and is typically tailored to the problem at hand.

# Data Structures

int vs. long vs. unsigned_long

A **Data Structure** is a ==_particular implementation_ of an abstract data type.== There can be, and indeed often are, many different implementations to choose from. This stems from the unfortunate but unavoidable fact that any implementation of an ADT is _always_ going to be less powerful than the mathematical object that it emulates.  (9^293945755482044628309847462244923635284048274623124545353242342340980984203489029834025664784382984702594908527345128374683498253462364758329592873645687364566834587639029348489029834239847247237929392567298750293237533898743293747823998237474798295030948809234848940320577286! is a valid integer, but can you store it in a computer?)

We have to make concessions and consider the trade-offs between different data structures in order to build efficient and scalable programs. Which operations should we optimize? Do we care more about speed or memory-usage? Navigating these questions and choosing the right data structure for the job can mean the difference between a program finishing in seconds, hours, or never at all! 

## The Problem-solving Playbook

Does this all sound kinda complicated? It can be, but don’t worry! Building efficient programs takes practice, but it can be done if you follow these tried-and-true steps to programming success:

**Fore! 🏌️ For-malize the problem, that is!** We need a formal, mathematical representation of the problem at hand. This often means stripping away all unnecessary details until we’re left with only the most essential characteristics.

**Hut-hu- 🏈 High-level algorithms come next!** Don’t get too caught up in specifics just yet, a high-level algorithm describes the steps to take in plain English. It’s here that you can start to think about what kind of operations will be needed, which leads naturally into selecting an appropriate ADT.

**Come on, Ref! 🏁 Ref-ine that algorithm!** Now that you have an idea of what type of ADT you’ll be using, it’s time to think about the best way of implementing it into a data structure. Which operations are most important, and what can you sacrifice in the name of overall efficiency?

**Stick 🏒 to the plan!** Everything’s in place for the perfect play, all that’s left is to implement! That said, no program is perfect. You can continue to iterate on these steps, further refining your algorithm, exploring a totally different high-level solution, or even changing how you represent the problem in the first place!

* [x] garret w
* [x] ryan
* [x] dheeraj
* [x] duc
* [x] sarah
* [x] ben w
* [x] garret h
* [x] tony
* [x] sarah
      
