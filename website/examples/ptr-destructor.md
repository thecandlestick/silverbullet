```c++
class IntBox  // example class with dynamic member variable
{
  int *item;
  public:
    IntBox(int i){ item = new int(i); }
    ~IntBox();
};

int main()
{
  for (int i = 0; i < 3; i++)
  {
    IntBox myintbox(i);
  }  // Destructor called here

  return 0;
}

IntBox::~IntBox()  // "proper" destructor
{
  delete item;
}
```