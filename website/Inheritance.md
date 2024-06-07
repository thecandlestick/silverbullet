---
tags: template
hooks.snippet.slashCommand: inheritance
---

# Inheritance in C++

Definition:
  The ability to declare a class as an _extension_ of another class

Through this process, a **derived class** inherits all member variables and all member functions of a **base class** (except for constructors/destructors). The derived class may then extend the functionality through additional members.

[[examples/oop-inheritance]]
```c++
class 🐶
{
  bool unwavering_loyalty;
  public:
    char *name;
    void bark();
};

class 🐩 : public 🐶
{
  public:
    bool fluffy_coat;
    void snore();
};
```

_**evilllll**_
```c++
class 🌭 : public 🐶, public 🌞
{
  // multiple inheritance is possible... but ill-advised ⚠️
};
```

Most company coding standards and style guides will advise against _multiple inheritance(above)_ in favor of _composition(below)_.

```c++
class 🌭
{
  🐶 member1;
  🌞 member2;
};
```

---
[[examples/oop-type-compatibility]]
```c++
class 🐶
{
  private:
    bool happy_dog;
};

class 🐩 : public 🐶
{
  private:
    bool pedigree;
}

void walk(🐶 &d) { '🦮' ; d.happy_dog = true; }
bool is_purebred(🐩 p) { return p.pedigree; }

int main()
{
  🐶 fido;
  🐩 lucky;

  walk(fido);
  walk(lucky);  // Valid! walk() expects a 🐶 but accepts a 🐩

  🐶 *dog_ptr = &lucky; // Valid! Pointers can point to derived types
  
  🐶 rex(lucky);  // Valid! Even the copy constructor and operator=
  fido = lucky;

  is_purebred(fido); // Error! Function only accepts 🐩
  lucky = rex; // Error!

  try 
  {
    throw 🐩 poodle_error;
  }
  catch (🐶 dog_error)
  {
    cout << "base class catch blocks catch derived types too!";
  }
}
```

As a general rule, objects of a _derived type_ can be used anywhere that an object of the _base type_ is specified. The inverse, however, is not true. Objects of the _base type_ cannot be substituted for objects of the _derived type_.

An (somewhat) exception to this rule is that base and derived types are distinguished for the purpose of [[Encapsulation]] levels. 

---

When inheriting members of the base class, derived classes can redefine that member for their own purposes. The base version is still retained, however, in a separate _namespace_

[[examples/oop-redefine-members]]
```c++
class 🐶
{
  bool likes_pats;
  public:
    double bark_volume;
    void bark();
};

class 🐩 : public 🐶
{
  public:
    double bark_volume;
    void bark();
};

int main() {

  🐩 spot;  // 🐩 obj. has two bark_volume and two bark()

  spot.🐶::bark_volume = 5.0;  // Specify which using namespace
  spot.🐶::bark();

  spot.bark_volume = 1.5;  // Defaults to 🐩::
  spot.bark();

}
```

---

Constructors are not technically inherited from base to derived class, but a constructor for the derived class will implicitly make a call to the constructor for the base class _before_ executing its own. In other words, when creating an object of class GrannySmithApple below, the order of execution is:

```Apple Constr. -> GreenApple Constr. -> GrannySmithApple Constr.```

Which constructor gets called can be specified but defaults to the default constructor.

[[examples/oop-constructors]]
```c++
class Apple
{
  public:
    int 🌳, 🍎;
    Apple() : 🌳(0), 🍎(0) {}
    Apple(int a, int b) : 🌳(a), 🍎(b) {}
};

class GreenApple : public Apple
{
  public:
    int 🍏;
    GreenApple(int i) : 🍏(i) {}
    GreenApple() : Apple(1,1), 🍏(1) {}
};

class GrannySmithApple : public GreenApple
{
  public:
    int 👵🏻;
    GrannySmithApple() : 👵🏻(0) {}
    GrannySmithApple(int c) : GreenApple(c), 👵🏻(c) {}
};

int main()
{
  GreenApple myApple(3);  // 🌳 = ?  🍎 = ?  🍏 = ?
  GreenApple myOtherApple();  // 🌳 = ?  🍎 = ?  🍏 = ?

  GrannySmithApple maternalApple(); // 🌳 = ?  🍎 = ?  🍏 = ?  👵🏻 = ?
  GrannySmithApple paternalApple(7); // 🌳 = ?  🍎 = ?  🍏 = ?  👵🏻 = ?

}
```

#KnowledgeCheck: 
For variable paternalApple, what are the values of 🌳, 🍎, 🍏, 👵🏻?

---

Destructors follow a similar rule. The destructor of a derived class will implicitly make a call to the destructor of the base class _after_ executing its own. In other words, when an object of class GrannySmithApple leaves it’s scope, the order of execution is:

```~GrannySmithApple() -> ~GreenApple() -> ~Apple()```

[[examples/oop-destructors]]
```c++
class Apple
{
  public:
    int *orchard = new int;
    ~Apple() { delete orchard; }
};

class GreenApple : public Apple
{
  public:
    char *variety = new char[24];
    ~GreenApple() { delete [] variety; } 
};

class GrannySmithApple : public GreenApple
{
  public:
    int *exp_date = new int;
    float *price = new float;
    ~GrannySmithApple() { delete exp_date; delete price; }
};
```
---

Templates can be used to create derived classes, a template can be created as an extension of a base class, and a template can extend another template. 

What is important to keep in mind is that a template is _not a class_. In order to use a template for inheritance you _must_ supply a template parameter, even if that parameter is itself a templated type.

[[examples/oop-templates]]
```c++
template <typename T>
class 🐈
{
  T cat_template;
};

class 🐈‍⬛ : public 🐈<double> {};

template <typename T>
class 🐯 : public 🐈<T>
{
  T tiger_template;
}

template <typename T, typename U>
class 🦁 : public 🐈<T>
{
  U lion_template;
}
```
