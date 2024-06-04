## _new_ Operator

(Dynamically) Allocates a new variable or array of variables to the heap and returns a pointer to it

```my_pointer = new <type>``` used for dynamic variables

```my_pointer = new <type>[<size>]``` for dynamic arrays

## _delete_ Operator

Unlike local variables that get removed when leaving their scope, dynamic variables can persist indefinitely. It is therefore the _programmer’s_ responsibility to clean up after themselves. the _delete_ operator must be used to de-allocate a dynamic variable.

```delete <ptr>;```  used for dynamic variables

```delete [] <ptr>;```  used for dynamic arrays

