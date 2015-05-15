---
layout: slide
title: Programming in Scala
description:
  A slide to summarize basic programming in Scala.
theme: black
transition: slide
permalink: /slides/programming-in-scala/
---
<style type="text/css">
p { text-align: left; }
</style>

<section>
  <h1>Programming in Scala</h1>
  <p style="text-align:center;">
    <small>
      by <a href="http://luugiathuy.com">Luu Gia Thuy</a> /
      <a href="http://twitter.com/luugiathuy">@luugiathuy</a>
    </small>
    <br />
    <small>April 12, 2015</small>
  </p>
</section>

<section data-markdown>
### Functional Programming

Functions are *first class citizens*:

- they can be defined anywhere, including inside other functions
- like any other value, they can be passed as parameters to functions and
returned as results &#8594; *higher-order functions*
- as for other values, there exists a set operators to compose functions
</section>

<section data-markdown>
### Definitions

A *definition* can be:

- A *function definition* `def square(x: Int) = x * x`
- A *value definition* `val y = square(2)`

A *parameter*can be:

- A *call-by-value* parameter, like `(x: Int)`
- A *call-by-name* parameter, like `(y: => Int)`
</section>

<section data-markdown>
### Blocks in Scala

- A block is delimited by braces { ... }.
- It contains a sequence of definitions or expressions.
- *The last element of a block is an expression that defines its value.*
- The definitions inside a block are only visible from within the block.
- The definitions inside a block *shadow* definitions of the same names
outside the block.
</section>

<section data-markdown>
### Tail Recursion

If a function calls itself as its last action, the function's stack frame can
be reused. *Tail recursive* functions are iterative processes.

One can require that a function is tail-recursive using a `@tailrec` annotation:

```scala
@tailrec
def gcd(a: Int, b: Int): Int = ...
```
</section>

<section data-markdown>
### Higher-Order Function

```scala
def sum(f: Int => Int, a: Int, b: Int): Int =
  if (a > b) 0
  else f(a) + sum(f, a + 1, b)

def sumInts(a: Int, b: Int) = sum(id, a, b)
def sumCubes(a: Int, b: Int) = sum(cube, a, b)
def sumFactorials(a: Int, b: Int) = sum(fact, a, b)

def id(x: Int): Int = x
def cube(x: Int): Int = x * x * x
def fact(x: Int): Int = if (x == 0) 1 else fact(x - 1)
```

The type `A => B` is the type of a function that takes an argument of type `A`
and returns a result of type `B`.
</section>

<section data-markdown>
### Anonymous Functions

```scala
def sumInts(a: Int, b: Int) = sum(x => x, a, b)
def sumCubes(a: Int, b: Int) = sum(x => x * x * x, a, b)
```
</section>

<section data-markdown>
### Currying

```scala
def sum(f: Int => Int): (Int, Int) => Int = {
  def sumF(a: Int, b: Int): Int =
    if (a > b) 0
    else f(a) + sumF(a + 1, b)
  sumF
}

def sumInts = sum(x => x)
def sumCubes = sum(x => x * x * x)
def sumFactorials = sum(fact)

sumFactorials(10, 20) + sum(cube)(1, 10)
```
</section>

<section data-markdown>
### Currying

#### Multiple Parameter Lists

```scala
def sum(f: Int => Int)(a: Int, b: Int): Int =
  if (a > b) 0 else f(a) + sum(f)(a + 1, b)
```

What is the type of `sum`?

```scala
(Int => Int) => (Int, Int) => Int
```
</section>

<section data-markdown>
### Classes and Objects

```scala
class Rational(x: Int, y: Int) {
  def numer = x
  def denom = y
}
```
This definition introduces 2 entities:

- A new type, named `Rational`
- A *constructor* `Rational` to create elements of this type.

We call the elements of a class type *objects*.

Objects of the class `Rational` have two *members*, `numer` and `denom`.
</section>

<section data-markdown>
### Classes

#### Preconditions

```scala
class Rational(x: Int, y: Int) {
  require(y > 0, ”denominator must be positive”)
  ...
}
```

#### Auxiliary Constructors

```scala
class Rational(x: Int, y: Int) {
  def this(x: Int) = this(x, 1)
  ...
}
new Rational(2) > 2/1
```
</section>

<section data-markdown>
### Abstract Classes

```scala
abstract class IntSet {
  def incl(x: Int): IntSet
  def contains(x: Int): Boolean
}

class NonEmpty(elem: Int, left: IntSet, right: IntSet) extends IntSet {
  def contains(x: Int): Boolean =
    if (x < elem) left contains x
    else if (x > elem) right contains x
    else true
  def incl(x: Int): IntSet =
    if (x < elem) new NonEmpty(elem, left incl x, right)
    else if (x > elem) new NonEmpty(elem, left, right incl x) else this
}
```
</section>

<section data-markdown>
### Object Definition

```scala
object Empty extends IntSet {
  def contains(x: Int): Boolean = false
  def incl(x: Int): IntSet = new NonEmpty(x, Empty, Empty)
}
```

This defines a *singleton object* named `Empty`.

Singleton objects are values, so `Empty` evaluates to itself.
</section>

<section data-markdown>
### Traits

```scala
trait Planar {
  def height: Int
  def width: Int
  def surface = height * width
}
```

Classes, objects and traits can inherit from at most one class but arbitrary
many traits.

```scala
class Square extends Shape with Planar with Movable ...
```

Traits resemble interfaces in Java, but are more powerful because *they can
contains fields and concrete methods*.

Traits cannot have constructor parameters. Traits are fully interoperable with
Java only if they do not contain any implementation code.
</section>

<section>
  <h3>Scala's class hierarchy</h3>
  <img src="/images/scala-class-hierarchy.png" alt="Scala's class hierarchy" />
</section>

<section data-markdown>
### Top Types

|||
|---|---|
|`Any`|The base type of all types. Methods: `==`, `!=`, `equals`, `hashCode`, `toString`|
|`AnyRef`|The base type of all reference types; Alias of `java.lang.Object`|
|`AnyVal`|The base type of all primitive types.|
</section>

<section data-markdown>
### Types

#### The `Nothing` Type

- `Nothing` is at the bottom of Scala’s type hierarchy. It is a subtype of every
other type.
- There is no value of type `Nothing`.
- To signal abnormal termination
- As an element type of empty collections
</section>

<section data-markdown>
### Types

#### The `Null` Type

- Every reference class type also has `null` as a value.
- The type of `null` is `Null`.
- `Null` is a subtype of every class that inherits from `Object`; it is
*incompatible* with subtypes of `AnyVal`.
</section>

<section data-markdown>

### Type Parameters

```scala
trait List[T] {
  def isEmpty: Boolean
  def head: T
  def tail: List[T]
}

class Cons[T](val head: T, val tail: List[T]) extends List[T] {
  def isEmpty = false
}

class Nil[T] extends List[T] {
  def isEmpty = true
  def head = throw new NoSuchElementException("Nil.head")
  def tail = throw new NoSuchElementException("Nil.tail")
}
```

Like classes, functions can have type parameters too.
</section>

<section data-markdown>
### Polymorphism

We have seen two principal forms of polymorphism:

- subtyping: instances of a subclass can be passed to a base class
- generics: instances of a function or class are created by type parameterization.
</section>

<section data-markdown>
### Type Bounds

- `S <: T ` means: `S`is a subtype of `T`
- `S >: T ` means: `S` is a supertype of `T`, `T` is a subtype of `S`

Mixed Bounds:

```scala
  [S >: NonEmpty <: IntSet]
```
The *Liskov Substitution Principle*:

```
If A &lt;&#58; B, then everything one can to do with a value of type B one
should also be able to do with a value of type A.
```
</section>

<section data-markdown>
### Variance

Say `C[T]` is a parameterized type and `A,B` are types such that `A <: B`

|||
|---|---|
|`C[A] <: C[B]`|`C` is *covariant*|
|`C[A] >: C[B]`|`C` is *contravariant*|
|neither `C[A]` or `C[B]` is a subtype of the other|`C` is *nonvariant*|

Declare the variance of a type

```scala
class C[+A] { ... }
class C[-A] { ... }
class C[A]  { ... }
```
</section>

<section data-markdown>
### Case Class

```scala
trait Expr
case class Number(n: Int) extends Expr
case class Sum(e1: Expr, e2: Expr) extends Expr
```

It also *implicitly* defines companion objects with apply methods.

```scala
object Number {
  def apply(n: Int) = new Number(n)
}
object Sum {
  def apply(e1: Expr, e2: Expr) = new Sum(e1, e2)
}
```

so we can write `Number(1)` instead of `new Number(1)`.
</section>

<section data-markdown>
### Case Class - Pattern Matching

Pattern matching is a generalization of switch from C/Java to class hierarchies.

```scala
def eval(e: Expr): Int = e match {
  case Number(n) => n
  case Sum(e1, e2) => eval(e1) + eval(e2)
}
```

A `MatchError` exception is thrown if no pattern matches the value of the selector.
</section>

<section data-markdown>
### Forms of Patterns

Patterns are constructed from:

- constructors, e.g. Number, Sum,
- variables, e.g. n, e1, e2,
- wildcard patterns _,
- constants, e.g. 1, true.

Variables always begin with a lowercase letter.

The same variable name can only appear once in a pattern. So, `Sum(x, x)` is not
a legal pattern.

Names of constants begin with a capital letter, with the exception of the
reserved words `null`, `true`, `false`.
</section>

<section>
  <h3>Scala's Collection Hierarchy</h3>
  <img src="/images/scala-collection-diagram.png" alt="Scala's Collection Hierarchy Diagram" />
</section>

<section>
  <img src="/images/scala-sequence-operations.png" alt"Scala's Sequence Operations" />
</section>

<section data-markdown>
### For Expressions

Let `persons` be a list of elements of class `Person`, with fields `name` and
`age`.

```scala
case class Person(name: String, age: Int)
```

To obtain the names of persons over 20 years old:

```scala
for (p <- persons if p.age > 20) yield p.name
```

which is equivalent to:

```scala
persons filter (p => p.age > 20) map (p => p.name)
```
</section>

<section data-markdown>
### The Option Type

```
trait Option[+A]
case class Some[+A](value: A) extends Option[A]
object None extends Option[Nothing]
```

The expression `map get key` returns

- `None` if `map` does not contains the given `key`,
- `Some(x)` if `map` associates the given `key` with the value `x`.
</section>

<section data-markdown>
### Lazy Evaluation

```scala
def expr = {
  val x = { print(”x”); 1 }
  lazy val y = { print(”y”); 2 }
  def z = { print(”z”); 3 }
  z+y+x+z+y+x
}
expr
```

"`xzyz`" will be printed.
</section>

<section data-markdown>
### Monad

A monad is a parametric type `M[T]` with two operations, `flatMap` and `unit`,
that have to satisfy some laws.

```scala
trait M[T] {
  def flatMap[U](f: T => M[U]): M[U]
}

def unit[T](x: T): M[T]
```

</section>

<section data-markdown>
### Monad Laws

To qualify as a nomad, a type has to satify three laws:

#### Associativity

```scala
m flatMap f flatMap g == m flatMap (x => f(x) flatMap g)
```

#### Left unit

```scala
unit(x) flatMap f  ==  f(x)
```

#### Right unit

```scala
m flatMap unit  ==  m
```
</section>

<section data-markdown>
### Example of Monads

- List is a monad with `unit(x) = List(x)`
- Set is monad with `unit(x) = Set(x)`
- Option is a monad with `unit(x) = Some(x)`
- Generator is a monad with `unit(x) = single(x)`
</section>

<section data-markdown>
## References

* [Functional Programming Principles in Scala - Coursera](https://www.coursera.org/course/progfun)

* [Principles of Reactive Programming - Coursera](https://www.coursera.org/course/reactive)
</section>

