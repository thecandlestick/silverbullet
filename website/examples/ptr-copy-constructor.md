```c++
class IntBox  // example class with dynamic member variable
{
  int *item;
  public:
    IntBox(int i) { item = new int(i); }
    IntBox( const IntBox &rhs );
};

int main()
{

  IntBox b1(3); //created with parameterized constructor
  IntBox b2(b1); //created with copy constructor
  IntBox b3 = b1; //also created with copy constructor
  
  return 0;
}

// “proper" copy constructor
IntBox::IntBox( const IntBox &rhs )
{
  item = new int;  // initialize pointer

  *this = rhs; // common trick: invoke operator=
  // *item = *rhs.item (would also work)
}
```