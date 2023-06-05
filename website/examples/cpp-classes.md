A typical class
```c++
class name_of_type
{
  public:
    // function prototypes here
  private:
    // member data here
};
```

```c++
#include <iostream>
using namespace std;

class Rectangle
{
  private:
    int width, height;
  public:
    void set_values(int, int);  
    //You don't have to give names to parameters in prototypes! 🤯
    int area() {return width*height;} //"inline" function
};

int main()
{
  Rectangle rect, rectb;
  rect.set_values(3, 4);
  rectb.set_values(5, 6);
  cout << "rect area: " << rect.area() << endl
       << "rectb area: " << rectb.area() << endl;
  return 0;
}

// <Return Type> <Namespace(class name)>::<Function>(<Parameters>)
void Rectangle::set_values(int x, int y)
{
  width = x;
  height = y;
}
```