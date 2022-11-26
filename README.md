# How to Write a Turing Complete Language In 75 Lines of JavaScript

A Turing Complete language can do anything any other language can, so if your language is Turing Complete, it is fully as capable as any other language ever made. Of course, there is a big difference between Turing Complete and easy to use...

One simple method of verifying if your language is Turing Complete is to create a [Turing Machine](https://en.wikipedia.org/wiki/Turing_machine) in your language. To create a Turing Machine you need 4 things:

1. **Basic Arithmetic:** `+, -, *, /` (\*)
2. **Comparators:** `<, >, <=, >=, ==, !=` (\*)
3. **Unbounded, Index-Addressable Memory:** Basically, an arbitrarily large array you can read and write numbers from.
4. **Looping and Conditional Branching:** A `while` loop suffices for both, but we'll do an `if` statement, too.

> (\*) Strictly speaking you can do it with just a subset of the common operators, but we'll define the full set.

# Source

- [Turing Complete+ Source](./source/TuringCompleteParser.js) (including extra, "plus" features nice-to-have features like variables and if-statements)

Assembly Sequence (how to build it one step at a time):

1. [Step1 - Numbers](./steps/step1-number.js)
2. [Step2 - Arithmetic](./steps/step2-arithmetic.js)
3. [Step3 - Evaluate](./steps/step3-evaluate.js)
4. [Step4 - Memory](./steps/step4-memory.js)
5. [Step5 - Sequencing](./steps/step5-sequencing.js)
6. [Step6 - While](./steps/step6-while-turing-complete.js) <-- TURING COMPLETE AT THIS POINT!
7. [Step7 - Numbers](./steps/step7-if.js)
8. [Step8 - Numbers](./steps/step8-variables.js)

# Examples

### Simple While

```javascript
i = 4;
s = 1;
while i > 0 do (
  i = i - 1;
  s = s * 2
)
```

### Fibonacci

```javascript
fib = 10;
if fib <= 2 then 1
else (
  fib1 = fib2 = 1;
  i = 2;
  while i < fib do (
    temp = fib1 + fib2;
    fib1 = fib2;
    i = i + 1;
    fib2 = temp;
  )
)
```

### Turing Machine

Simulate a turing machine:

- `state` == current state (any state < 0 is a stop-state)
- `head` == data read/write head position
- `stateOffset` == state-program read position (re-calculated each loop)

To 'program' your Turing Machine, set the following in-memory values:

- `numSymbols` == number of symbols (number values in memory) this machine recognizes
- Set `head` to a value large enough that head will never overlap `numStates * numSymbols`
- Your Program should start at [0] and extend through `[numStates * numSymbols]`
  - `[state * numSymbols * 3]` == write at the current head position (any valid symbol)
  - `[state * numSymbols * 3]` == move head amount (-1, 0, 1)
  - `[state * numSymbols * 3]` == next-state (states starting from 0)
- You can also initialize your data
  - `[head]` == data

```javascript
state = 0
numSymbols = 10
head = 10000
while state >= 0 do (
  stateOffset = (state * numSymbols) * 3;
  [head] = [stateOffset];
  head = head + [stateOffset + 1];
  state = [stateOffset + 2];
)
```

# CaffeineScript

I prefer to write JavaScript using CaffeineScript, a language I created to make JavaScript more readable and more than 3x faster to write. If you are curious, the same Turing-Complete+ language we defined above in ~100 lines of JavaScript takes just 30 lines of CaffeineScript (with the conceit of longer lines which, IMO, improve readability in this narrow case):

```coffee
class TuringCompleteParser extends &CaffeineEight.Parser
  getStore:   -> @store ?= []
  getContext: -> @context ?= {}
  operators   = {}
  getOperator = (op) -> operators[op] ?= eval "" (a, b) => a #{op} b

  # SEQUENCING
  @rule root:       [] "expression nextExpr* _? ';'?"                               evaluate: -> reduce last, e in @nextExprs inject @expression.evaluate() do e.expression.evaluate()
  @rule nextExpr:   [] "_? ';' _? expression"

  # ARITHMETIC
  @rule expression: [] "operand _? op:/==|!=|<=|>=|[-+*\\/<>]/ _? operand"          evaluate: -> getOperator(@op.text) (array op in @operands with op.evaluate())...
  @rule expression: [] "operand"                                                    evaluate: -> @operand.evaluate()
  @rule operand:    [] "'(' _? root _? ')'"                                         evaluate: -> @root.evaluate()
  @rule operand:    [] /-?[0-9]+/                                                   evaluate: -> eval @text
  @rule _:          [] /\s+/

  # MEMORY
  @rule expression: [] "'[' _? expression _? ']' _? '=' _? value:expression"        evaluate: -> @parser.getStore()[@expression.evaluate()] = @value.evaluate()
  @rule expression: [] "'[' _? expression _? ']'"                                   evaluate: -> @parser.getStore()[@expression.evaluate()]

  # LOOPING AND CONDITIONALS
  @rule operand:    [] "'while' _ test:expression _ 'do' _ body:expression"         evaluate: -> while @test.evaluate() do @body.evaluate()
  @rule operand:    [] "'if' _ test:expression _ 'then' _ then:expression _ else?"  evaluate: -> if @test.evaluate() then @then.evaluate() else @else?.expression.evaluate()
  @rule else:       [] "'else' _ expression"

  # VARIABLES
  @rule operand:    [] "identifier _? '=' _? expression"                            evaluate: -> @parser.getContext()[@identifier.text] = @expression.evaluate()
  @rule operand:    [] "identifier"                                                 evaluate: -> @parser.getContext()[@identifier.text]
  @rule identifier: [] /\w+/
```

To run this code:

```shell
> npm install caffeine-script
> caf TuringCompleteParser.caf
```
