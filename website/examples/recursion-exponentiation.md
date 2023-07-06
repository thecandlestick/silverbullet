```c++
int recursive_pow(int base, int power)
{
  if (power == 0)
    return 1;
  if (power == 1)  // Base Cases
    return base;

  int half_power = pow(base, power/2); // Recursive Case
  if (n % 2 == 0)
    return half_power*half_power; // Composition
  else
    return half_power*half_power*base; // Account for int division /
}
```