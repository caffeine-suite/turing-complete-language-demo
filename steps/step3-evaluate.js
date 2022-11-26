class TcParser extends require("caffeine-eight").Parser {}

//*************************************************
//  SEQUENCING
TcParser.rule("root", "expression", {
  evaluate() {
    return this.expression.evaluate();
  },
});

//*************************************************
//  ARITHMETIC
const operators = {};
const getOperator = op => operators[op] || (operators[op] = eval(`(a, b) => a ${op} b`));
TcParser.rule("expression", "operand _? op:/==|!=|<=|>=|[-+*\\/<>]/ _? operand", {
  evaluate() {
    return getOperator(this.op.text)(...this.operands.map(n => n.evaluate()));
  },
});

TcParser.rule("expression", "operand", {
  evaluate() {
    return this.operand.evaluate();
  },
});

TcParser.rule("operand", "'(' _? root _? ')'", {
  evaluate() {
    return this.root.evaluate();
  },
});

TcParser.rule("operand", /-?[0-9]+/, {
  evaluate() {
    return eval(this.text);
  },
});
TcParser.rule("_", /\s+/);

//*************************************************
//  MEMORY

//*************************************************
//  LOOPING AND CONDITIONALS

//*************************************************
//  VARIABLES

TcParser.repl();
