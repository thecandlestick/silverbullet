```c++
#include <vector>
#include <utility>
using namespace std;

typedef Vector<pair<float,float>> ranges;
// Got a tongue-twister of a type? Use a typedef!

ranges partition(float begin, float end, int p)
{
  //Returns a vector of p equal partitions in range [begin, end]
  ranges partitions;
  float partition_size = (end - begin) / p;

  pair<float, float> range;
  range.first = begin;
  range.second = begin + partition_size;
  for (int i=0; i < p; i++)
  {
    partitions.push_back(pair<float,float>(range));
    range.first = range.second;
    range.second += partition_size;
  }

  return partitions;
}
```

**Now let's add some exception handling!**
```c++
ranges partition(float begin, float end, int p)
{
  //Returns a vector of p equal partitions in range [begin, end]
  ranges partitions;
  try {  // exception may occur in this block!
    if (p <= 0) throw p;  // throwing exception, jump to catch block!

    float partition_size = (end - begin) / p;

  
    pair<float, float> range;
    range.first = begin;
    range.second = begin + partition_size;
    for (int i=0; i < p; i++)
    {
      partitions.push_back(pair<float,float>(range));
      range.first = range.second;
      range.second += partition_size;
    }
  }  // end try-block
  catch(int bad_p)  //code execution resumes here if exception thrown
  { 
    cout << "invalid number of partitions: " << bad_p <<
         << "returning empty vector!" << endl; 
  }
  return partitions;
}
```