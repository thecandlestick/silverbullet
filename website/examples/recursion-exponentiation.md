_iterative_ implementation

```c++
int iterative_exp(int base, int power)
{
  int result = 1;
  for (int i = 0; i < power; i++)
  {
    result = result * base;
  }
  return result;
}
```

_recursive_ implementation

```c++
int recursive_exp(int base, int power)
{
  if (power == 0)
    return 1;
  if (power == 1)  // Base Cases
    return base;

  int half_power = recursive_exp(base, power/2); // Recursive Case
  if (power % 2 == 0)
    return half_power*half_power; // Composition
  else
    return half_power*half_power*base; // Account for int division /
}
```

