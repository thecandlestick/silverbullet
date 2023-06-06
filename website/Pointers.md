
# Memory Model

The programming in this course will have you directly manipulating _memory_. Before that, we first need to clarify what exactly we mean by _memory_. 

Your program, and any variables it creates, live in the memory of your computer. This memory is a limited resource. Use too much and the computer slows; use more than you have and the program crashes!

## Memory as a Tape

You can think of memory as a continuous tape of addressable _cells_

<>

Of course, not all datum fit neatly into a fixed-size _cell_, but this model is good enough to discuss what happens during code execution.

## Memory Diagrams

When writing programs, we rarely concern ourselves with the underlying particulars of memory. Those details are abstracted away in high level programming languages.

A more common way of representing the state of memory is using _memory diagrams_.

<>

# Pointers in C++


## Address-of (&) Operator

[[examples/ptr-addr-of]]

## Declaration

[[examples/ptr-declaration]]

## De-reference (*) Operator

[[examples/ptr-dereference]]

## _const_ and Pointers

[[examples/ptr-const]]

## Pointers as Parameters

[[examples/ptr-param]]

## Arrays of Pointers 

[[examples/ptr-array]]

## Pointers in Structs & Classes

[[examples/ptr-member]]

## Pointers to Classes

[[examples/ptr-class]]

# Dynamic Memory

## _new_ Operator

[[examples/ptr-new]]

## _delete_ Operator

[[examples/ptr-delete]]

## Problems with Pointers

[[examples/ptr-dangling]]

[[examples/ptr-mem-leak]]

## 2D-Dynamic Array

[[examples/ptr-2d-array]]

# Default Member Functions


## Destructor

[[examples/ptr-destructor]]

## Operator=

[[examples/ptr-assign-op]]

## Copy Constructor

[[examples/ptr-copy-constructor]]