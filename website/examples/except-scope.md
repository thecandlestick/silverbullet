```c++
#include <vector>
#include <utility>
using namespace std;

typedef Vector<pair<float,float>> ranges;

ranges partition(float begin, float end, int p)
{
  //Returns a vector of p equal partitions in range [begin, end]
  if (end <= begin) throw "end must be greater than begin!";
  if (p <= 0) throw p;  // throwing exception, jump to catch block!
    
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

int main()
{

  try{ // calling a function with possible exceptions
    ranges myRanges = partition(2.0, 5.0, 4);
  }
  catch( ... )  // and deciding how to handle them!
  {  
    cout << "something went wrong!" << endl;
  }

  return 0;
}
```