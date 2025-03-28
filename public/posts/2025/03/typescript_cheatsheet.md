# Python to TypeScript: The Ultimate Migration Guide

As more backend systems embrace TypeScript for its type safety and modern JavaScript features, many Python developers find themselves needing to bridge the gap between these two powerful languages. This guide will help you translate your Python knowledge into TypeScript expertise.

This blog was powerful by AI 80%.

## Why Make the Switch?

TypeScript offers several advantages that might appeal to Python developers:

- **Static typing** with the flexibility to be as strict or loose as needed
- **Modern JavaScript features** with backward compatibility
- **Rich IDE support** with excellent autocompletion and error detection
- **Seamless frontend integration** when working on full-stack applications

## Cheatsheet
| **Feature/Syntax**                | **Python**                                      | **TypeScript**                                  | **Notes**                                                                                   |
|-----------------------------------|------------------------------------------------|------------------------------------------------|---------------------------------------------------------------------------------------------|
| **Variable Declaration**          | `x = 5`                                        | `let x: number = 5;`                          | TypeScript uses `let` or `const`; `var` is legacy (hoisting issues).                       |
| **Constant**                      | `X = 5` (convention, not enforced)            | `const x: number = 5;`                        | TypeScript enforces immutability for `const` (but object properties can still change).      |
| **Global Variables**              | `global x; x = 5`                             | `declare global { let x: number; }; x = 5;`   | TypeScript requires `declare` for globals, often in `.d.ts` files.                         |
| **Data Types**                    | Dynamic: `x = 5; x = "hi"`                    | Static: `let x: number = 5;`                  | Core types: `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.         |
| **Any Type**                      | Not explicit (all vars are "any" by default)  | `let x: any = 5;`                             | `any` disables type checking; use sparingly to avoid losing TypeScript benefits.           |
| **Strings**                       | `s = "hello"`                                 | `let s: string = "hello";`                    | Supports template literals: `` `Hi ${name}` `` in TypeScript (similar to Python f-strings). |
| **F-Strings/Template Literals**   | `f"Hi {name}"`                                | `` `Hi ${name}` ``                            | TypeScript uses backticks; Python’s f-strings are more concise.                            |
| **Lists/Arrays**                  | `lst = [1, 2, 3]`                            | `let arr: number[] = [1, 2, 3];`              | TypeScript also supports `Array<number>`; immutable arrays via `readonly number[]`.         |
| **Dictionaries/Objects**          | `d = {"key": "value"}`                       | `let obj: { key: string } = { key: "value" };`| TypeScript requires explicit object shapes or interfaces.                                 |
| **Tuples**                        | `t = (1, "two")`                             | `let t: [number, string] = [1, "two"];`       | TypeScript tuples are fixed-length; Python tuples are immutable but untyped.               |
| **Sets**                          | `s = {1, 2, 3}`                              | `let s: Set<number> = new Set([1, 2, 3]);`    | TypeScript uses ES6 `Set`; Python sets are more concise to declare.                        |
| **Type Annotations**              | `x: int = 5` (optional)                      | `let x: number = 5;` (required)               | Python’s hints are runtime-ignored unless using tools like `mypy`; TypeScript enforces.     |
| **Union Types**                   | `x: int \| str` (Python 3.10+)                | `let x: number \| string;`                     | TypeScript unions are compile-time checked; Python relies on runtime or external tools.     |
| **Optional Types**                | `x: Optional[int] = None` (via `typing`)      | `let x: number \| null = null;`                | TypeScript uses `\| null` or `\| undefined`; Python uses `Optional` from `typing`.           |
| **Type Aliases**                  | `from typing import TypeAlias; MyType = int` | `type MyType = number;`                       | TypeScript’s `type` keyword is more flexible (e.g., unions, intersections).                |
| **Interfaces**                    | Not native; use ABCs (`abc`)                  | `interface MyInterface { x: number; }`        | TypeScript interfaces are key for OOP; extendable with `extends`.                          |
| **Functions**                     | `def add(a, b): return a + b`                | `function add(a: number, b: number): number { return a + b; }` | TypeScript requires return type; optional with `: void` if none.                           |
| **Arrow Functions**               | `lambda x: x + 1`                            | `(x: number) => x + 1`                       | TypeScript arrow functions are JS-style; concise for callbacks.                           |
| **Optional Parameters**           | `def func(x=10): ...`                        | `function func(x: number = 10): void { ... }` | Similar behavior; TypeScript adds `?:` for optional (e.g., `x?: number`).                  |
| **Rest Parameters**               | `def func(*args): ...`                       | `function func(...args: number[]): void { ... }` | TypeScript uses `...` with type; Python’s `*args` is untyped by default.                   |
| **Keyword Arguments**             | `def func(a=1, b=2): ...; func(b=3)`         | `function func({ a = 1, b = 2 }: { a?: number, b?: number }): void { ... }` | TypeScript uses object destructuring; no direct keyword arg support.                       |
| **Function Overloading**          | Not native; use `@overload` (via `typing`)    | `function func(x: number): string; function func(x: string): number; function func(x: any): any { ... }` | TypeScript supports overloading natively; Python relies on runtime checks.                 |
| **Classes**                       | `class MyClass: ...`                         | `class MyClass { ... }`                       | TypeScript adds `public`, `private`, `protected` modifiers.                                |
| **Class Attributes**              | `self.x = 5`                                 | `x: number = 5;` (or `private x: number = 5;`) | TypeScript requires declaration; visibility explicit.                                      |
| **Static Attributes**             | `class C: x = 5`                             | `class C { static x: number = 5; }`           | TypeScript uses `static` keyword; accessed as `C.x` in both.                               |
| **Methods**                       | `def method(self, a): ...`                   | `method(a: number): void { ... }`             | No `self` in TypeScript; `this` is implicit and typed.                                     |
| **Static Methods**                | `@staticmethod def func(): ...`            | `static func(): void { ... }`                 | TypeScript uses `static`; no decorator needed.                                             |
| **Inheritance**                   | `class Child(Parent): ...`                   | `class Child extends Parent { ... }`          | TypeScript supports single inheritance; use interfaces for multiple behaviors.             |
| **Multiple Inheritance**          | `class C(A, B): ...`                         | Not directly; use `implements`: `class C implements A, B { ... }` | TypeScript uses interfaces for multiple "inheritance"; no true multiple class inheritance. |
| **Abstract Classes**              | `from abc import ABC, abstractmethod; class A(ABC): @abstractmethod def m(self): ...` | `abstract class A { abstract m(): void; }` | TypeScript’s `abstract` is native; Python requires `abc` module.                           |
| **Magic Methods (Special)**       | `__init__(self, x)`                          | `constructor(x: number) { this.x = x; }`      | TypeScript uses `constructor`; no direct equivalent to Python’s `__dunder__` methods.      |
| **String Representation**         | `__str__(self)`                              | `toString(): string { return "..."; }`        | TypeScript’s `toString` is explicit; Python’s `__str__` is automatic for `str()`.          |
| **Getters/Setters**               | `@property def x(self): ...; @x.setter ...`  | `get x(): number { ... }; set x(v: number) { ... }` | TypeScript uses `get`/`set` keywords; Python uses decorators.                              |
| **Operator Overloading**          | `__add__(self, other)`                       | Not natively supported; use methods          | TypeScript lacks operator overloading; implement via explicit methods (e.g., `add()`).     |
| **Modules/Exporting**             | `x = 5` (in `mod.py`)                        | `export const x: number = 5;`                | TypeScript uses ES6 modules; explicit `export` required.                                   |
| **Importing**                     | `from mod import x`                          | `import { x } from "./mod";`                  | TypeScript requires file extensions (`.ts`) in some configs; supports `import * as`.       |
| **Default Exports**               | Not native; module-level vars                | `export default class MyClass { ... }`        | TypeScript supports one default export per module; imported as `import MyClass from ...`.  |
| **Re-exporting**                  | Not native; reassign in `__init__.py`        | `export { x } from "./mod";`                  | TypeScript allows re-exporting; Python uses package-level imports.                         |
| **Decorators**                    | `@decorator def func(): ...`                 | `@decorator() class MyClass { ... }`          | TypeScript decorators are experimental; mainly for classes, not functions.                 |
| **Loops (For)**                   | `for i in range(5): ...`                     | `for (let i = 0; i < 5; i++) { ... }`        | TypeScript uses C-style loops; Python’s `range` is more declarative.                       |
| **Loops (For Each)**              | `for x in lst: ...`                          | `for (const x of arr) { ... }`                | TypeScript’s `for...of` iterates values; `for...in` iterates keys (avoid for arrays).       |
| **While Loop**                    | `while x < 5: ...`                           | `while (x < 5) { ... }`                       | Similar; TypeScript requires braces and parentheses.                                       |
| **List Comprehension**            | `[x * 2 for x in lst]`                       | `lst.map((x: number) => x * 2)`              | TypeScript uses array methods (`map`, `filter`, `reduce`); no comprehension syntax.        |
| **Exception Handling**            | `try: ... except Exception as e: ...`        | `try { ... } catch (e: unknown) { ... }`      | TypeScript’s `catch` types as `unknown` by default; cast if needed (e.g., `e as Error`).   |
| **Raising Exceptions**            | `raise ValueError("msg")`                    | `throw new Error("msg");`                     | TypeScript uses JS-style `Error` objects; Python has built-in exception hierarchy.         |
| **Async/Await**                   | `async def func(): await asyncio.sleep(1)`   | `async function func(): Promise<void> { await sleep(1000); }` | TypeScript requires `Promise<T>`; Python integrates with `asyncio`.                        |
| **Generators**                    | `def gen(): yield 1; yield 2`                | `function* gen(): IterableIterator<number> { yield 1; yield 2; }` | TypeScript uses `*` for generators; typed with `IterableIterator`.                         |
| **Enums**                         | `from enum import Enum; class E(Enum): A = 1` | `enum E { A = 1 }`                           | TypeScript’s `enum` is native; Python requires `enum` module.                              |
| **Type Assertions**               | Not native; runtime checks                   | `let x = y as number;` or `<number>y`         | TypeScript allows type casting; use cautiously as it bypasses checks.                      |
| **Non-null Assertion**            | Not native                                   | `x!.property`                                 | TypeScript’s `!` asserts non-null/undefined; no Python equivalent.                         |
| **Namespaces**                    | `import pkg.mod`                             | `namespace MyNamespace { export class C {} }` | TypeScript’s `namespace` groups code; Python uses modules/packages.                        |

## Core Language Concepts

### Variable Declaration and Types

Python's dynamic typing is simple but can lead to runtime errors. TypeScript brings static typing while maintaining readability:

```python
# Python - Dynamic typing
x = 5           # No type declaration needed
x = "hello"     # Can change types freely
```

```typescript
// TypeScript - Static typing
let x: number = 5;       // Explicit type
const y = 10;            // Type inferred as number
// x = "hello";          // Error: Type 'string' is not assignable to type 'number'
```

TypeScript's type system includes:

- **Primitive types**: `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
- **Complex types**: Arrays, objects, functions, classes, etc.
- **Special types**: `any`, `unknown`, `never`, `void`

### Type Annotations and Inference

TypeScript can often infer types, but explicit annotations help with clarity:

```python
# Python type hints (optional)
def greet(name: str) -> str:
    return f"Hello, {name}"
```

```typescript
// TypeScript (required for parameters)
function greet(name: string): string {
    return `Hello, ${name}`;
}

// Type inference works for variables
const message = greet("World");  // Inferred as string
```

### Working with Collections

#### Arrays vs Lists

```python
# Python lists
numbers = [1, 2, 3]
numbers.append(4)
```

```typescript
// TypeScript arrays
const numbers: number[] = [1, 2, 3];
// Alternative syntax: Array<number>
numbers.push(4);

// Readonly arrays
const constants: readonly number[] = [1, 2, 3];
// constants.push(4);  // Error: Property 'push' does not exist
```

#### Dictionaries vs Objects

```python
# Python dictionaries
user = {"name": "Alice", "age": 30}
user["role"] = "Admin"
```

```typescript
// TypeScript objects
interface User {
    name: string;
    age: number;
    role?: string;  // Optional property
}

const user: User = { name: "Alice", age: 30 };
user.role = "Admin";
```

#### Sets

```python
# Python sets
unique_numbers = {1, 2, 3}
unique_numbers.add(4)
```

```typescript
// TypeScript sets
const uniqueNumbers: Set<number> = new Set([1, 2, 3]);
uniqueNumbers.add(4);
```

#### Tuples

```python
# Python tuples
coordinates = (10.5, 20.3)
```

```typescript
// TypeScript tuples (fixed-length arrays with specific types)
const coordinates: [number, number] = [10.5, 20.3];
```

### String Formatting

Python's f-strings and TypeScript's template literals are quite similar:

```python
# Python f-strings
name = "Alice"
age = 30
message = f"{name} is {age} years old"
```

```typescript
// TypeScript template literals
const name = "Alice";
const age = 30;
const message = `${name} is ${age} years old`;
```

## Functions and Parameters

### Basic Functions

```python
# Python function
def add(a, b):
    return a + b
```

```typescript
// TypeScript function
function add(a: number, b: number): number {
    return a + b;
}
```

### Arrow Functions (Lambda)

```python
# Python lambda
double = lambda x: x * 2
```

```typescript
// TypeScript arrow function
const double = (x: number): number => x * 2;
```

### Optional and Default Parameters

```python
# Python optional parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}"
```

```typescript
// TypeScript optional parameters
function greet(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}`;
}

// Alternative with ? syntax
function greet2(name: string, greeting?: string): string {
    return `${greeting || "Hello"}, ${name}`;
}
```

### Rest Parameters

```python
# Python variable arguments
def sum_all(*numbers):
    return sum(numbers)
```

```typescript
// TypeScript rest parameters
function sumAll(...numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0);
}
```

### Function Overloading

```python
# Python (using @overload from typing)
from typing import overload, Union

@overload
def process(x: int) -> str: ...

@overload
def process(x: str) -> int: ...

def process(x: Union[int, str]) -> Union[str, int]:
    if isinstance(x, int):
        return str(x)
    else:
        return len(x)
```

```typescript
// TypeScript function overloading
function process(x: number): string;
function process(x: string): number;
function process(x: any): any {
    if (typeof x === "number") {
        return x.toString();
    } else {
        return x.length;
    }
}
```

## Control Flow

### Conditionals

```python
# Python if/elif/else
if x > 10:
    print("Greater than 10")
elif x > 5:
    print("Between 6 and 10")
else:
    print("5 or less")
```

```typescript
// TypeScript if/else if/else
if (x > 10) {
    console.log("Greater than 10");
} else if (x > 5) {
    console.log("Between 6 and 10");
} else {
    console.log("5 or less");
}
```

### Loops

```python
# Python for loop with range
for i in range(5):
    print(i)

# Python for-each loop
for item in items:
    print(item)
```

```typescript
// TypeScript for loop
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// TypeScript for-of loop (equivalent to Python's for-each)
for (const item of items) {
    console.log(item);
}

// TypeScript for-in loop (iterates over keys/indices)
for (const key in object) {
    console.log(key, object[key]);
}
```

### List Operations

```python
# Python list comprehension
squares = [x * x for x in range(10)]

# Python filter
evens = [x for x in range(10) if x % 2 == 0]
```

```typescript
// TypeScript using map
const squares = Array.from({length: 10}, (_, i) => i * i);
// Or with existing array:
// const squares = [...Array(10).keys()].map(x => x * x);

// TypeScript using filter
const evens = Array.from({length: 10}, (_, i) => i).filter(x => x % 2 === 0);
```

## Object-Oriented Programming

### Classes and Inheritance

```python
# Python class
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        return "Some sound"

class Dog(Animal):
    def speak(self):
        return "Woof!"
```

```typescript
// TypeScript class
class Animal {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    speak(): string {
        return "Some sound";
    }
}

class Dog extends Animal {
    speak(): string {
        return "Woof!";
    }
}
```

### Access Modifiers

```python
# Python (convention-based)
class Person:
    def __init__(self, name, _ssn):  # _ssn is private by convention
        self.name = name  # public
        self._ssn = _ssn  # private (by convention)
```

```typescript
// TypeScript (enforced)
class Person {
    public name: string;
    private ssn: string;
    
    constructor(name: string, ssn: string) {
        this.name = name;
        this.ssn = ssn;
    }
}
```

### Interfaces

```python
# Python (using ABC)
from abc import ABC, abstractmethod

class Drawable(ABC):
    @abstractmethod
    def draw(self):
        pass
        
class Circle(Drawable):
    def draw(self):
        print("Drawing a circle")
```

```typescript
// TypeScript interface
interface Drawable {
    draw(): void;
}

class Circle implements Drawable {
    draw(): void {
        console.log("Drawing a circle");
    }
}
```

### Static Members

```python
# Python static methods and class variables
class MathUtils:
    PI = 3.14159
    
    @staticmethod
    def add(a, b):
        return a + b
```

```typescript
// TypeScript static members
class MathUtils {
    static PI: number = 3.14159;
    
    static add(a: number, b: number): number {
        return a + b;
    }
}
```

## Advanced Types

### Union Types

```python
# Python union types (3.10+)
def process(value: int | str):
    pass
    
# Earlier Python versions
from typing import Union
def process(value: Union[int, str]):
    pass
```

```typescript
// TypeScript union types
function process(value: number | string): void {
    // ...
}
```

### Type Aliases

```python
# Python type aliases
from typing import TypeAlias, List

UserId: TypeAlias = int
Users: TypeAlias = List[UserId]
```

```typescript
// TypeScript type aliases
type UserId = number;
type Users = UserId[];
```

### Generics

```python
# Python generics
from typing import TypeVar, Generic, List

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self):
        self.items: List[T] = []
        
    def push(self, item: T) -> None:
        self.items.append(item)
        
    def pop(self) -> T:
        return self.items.pop()
```

```typescript
// TypeScript generics
class Stack<T> {
    private items: T[] = [];
    
    push(item: T): void {
        this.items.push(item);
    }
    
    pop(): T | undefined {
        return this.items.pop();
    }
}
```

## Modules and Imports

### Exporting and Importing

```python
# Python module (math_utils.py)
def add(a, b):
    return a + b

PI = 3.14159

# Importing in another file
from math_utils import add, PI
# Or
import math_utils
result = math_utils.add(1, 2)
```

```typescript
// TypeScript module (mathUtils.ts)
export function add(a: number, b: number): number {
    return a + b;
}

export const PI: number = 3.14159;

// Importing in another file
import { add, PI } from './mathUtils';
// Or
import * as mathUtils from './mathUtils';
const result = mathUtils.add(1, 2);
```

### Default Exports

```python
# Python doesn't have default exports
# Closest equivalent is having one main thing in a module
# calculator.py
class Calculator:
    def add(self, a, b):
        return a + b

# Importing
from calculator import Calculator
```

```typescript
// TypeScript default export
// calculator.ts
export default class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }
}

// Importing
import Calculator from './calculator';
```

## Asynchronous Programming

### Async/Await

```python
# Python async/await
import asyncio

async def fetch_data():
    await asyncio.sleep(1)  # Simulating API call
    return {"data": "value"}

async def process():
    data = await fetch_data()
    print(data)
    
# Running the async function
asyncio.run(process())
```

```typescript
// TypeScript async/await
async function fetchData(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));  // Simulating API call
    return { data: "value" };
}

async function process(): Promise<void> {
    const data = await fetchData();
    console.log(data);
}

// Running the async function
process();
```

### Promises vs Coroutines

```python
# Python coroutines
import asyncio

async def task1():
    await asyncio.sleep(1)
    return "result1"
    
async def task2():
    await asyncio.sleep(2)
    return "result2"
    
async def main():
    # Run concurrently
    results = await asyncio.gather(task1(), task2())
    print(results)  # ["result1", "result2"]
```

```typescript
// TypeScript promises
function task1(): Promise<string> {
    return new Promise(resolve => {
        setTimeout(() => resolve("result1"), 1000);
    });
}

function task2(): Promise<string> {
    return new Promise(resolve => {
        setTimeout(() => resolve("result2"), 2000);
    });
}

async function main(): Promise<void> {
    // Run concurrently
    const results = await Promise.all([task1(), task2()]);
    console.log(results);  // ["result1", "result2"]
}
```

## Error Handling

### Try/Except vs Try/Catch

```python
# Python exception handling
try:
    result = risky_operation()
except ValueError as e:
    print(f"Value error: {e}")
except Exception as e:
    print(f"Other error: {e}")
finally:
    cleanup()
```

```typescript
// TypeScript exception handling
try {
    const result = riskyOperation();
} catch (e) {
    if (e instanceof Error) {
        console.log(`Error: ${e.message}`);
    } else {
        console.log("Unknown error occurred");
    }
} finally {
    cleanup();
}
```

### Custom Errors

```python
# Python custom exceptions
class ValidationError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)
        
# Raising the error
raise ValidationError("Invalid input")
```

```typescript
// TypeScript custom errors
class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

// Throwing the error
throw new ValidationError("Invalid input");
```

## TypeScript-Specific Features

### Type Guards

```typescript
// TypeScript type guards
function processValue(value: string | number): void {
    if (typeof value === "string") {
        // TypeScript knows value is a string here
        console.log(value.toUpperCase());
    } else {
        // TypeScript knows value is a number here
        console.log(value.toFixed(2));
    }
}
```

### Utility Types

TypeScript provides built-in utility types that have no direct Python equivalent:

```typescript
// Partial - makes all properties optional
interface User {
    name: string;
    age: number;
}

function updateUser(user: User, updates: Partial<User>): User {
    return { ...user, ...updates };
}

// Pick - creates a type with only selected properties
type UserBasics = Pick<User, 'name'>;  // { name: string }

// Omit - creates a type without selected properties
type UserWithoutAge = Omit<User, 'age'>;  // { name: string }

// Record - creates a dictionary type
type UserRoles = Record<string, string[]>;
```

### Enums

```python
# Python enums
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

```typescript
// TypeScript enums
enum Color {
    RED = 1,
    GREEN = 2,
    BLUE = 3
}

// Constant enums (compile-time only)
const enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}
```

## Practical Tips for Python Developers

### Mindset Shifts

1. **Embrace static typing** - It catches errors early and improves documentation
2. **Think in terms of interfaces** - Define contracts before implementations
3. **Use TypeScript's type system** to your advantage - It's more powerful than Python's type hints

### Common Pitfalls

1. **The `any` type** - Avoid using it excessively as it defeats the purpose of TypeScript
2. **Null/undefined handling** - TypeScript has both, unlike Python's single `None`
3. **Hoisting** - Variables declared with `var` are hoisted, use `let`/`const` instead
4. **This binding** - Arrow functions preserve `this` context, regular functions don't

### Development Environment

For the best TypeScript experience:

1. **Use VS Code** - It has excellent TypeScript integration
2. **Configure tsconfig.json** properly - Set strict mode for maximum type safety
3. **Use ESLint** with TypeScript plugins for code quality
4. **Set up Jest** for testing TypeScript code

## Conclusion

Transitioning from Python to TypeScript involves learning new syntax and concepts, but many fundamental programming principles remain the same. TypeScript's type system offers a level of safety and tooling support that can significantly improve code quality and developer productivity.

By leveraging your Python knowledge and understanding the key differences outlined in this guide, you'll be writing idiomatic TypeScript code in no time.

Remember that TypeScript is a superset of JavaScript, so any valid JavaScript is also valid TypeScript. This gives you the flexibility to gradually add types to your code as you become more comfortable with the language.
