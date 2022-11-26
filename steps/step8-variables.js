class TcParser extends require("caffeine-eight").Parser {
  getStore() {
    return (this.store = this.store || []);
  }
  getContext() {
    return (this.store = this.store || {});
  }
}

//*************************************************
//  SEQUENCING
TcParser.rule("root", "expression extraExpression* _? ';'?", {
  evaluate() {
    let last = this.expression.evaluate();
    this.extraExpressions?.forEach(e => (last = e.expression.evaluate()));
    return last;
  },
});
TcParser.rule("extraExpression", "_? ';' _? expression");

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
TcParser.rule("operand", "'[' _? expression _? ']' _? '=' _? value:expression", {
  evaluate() {
    return (this.parser.getStore()[this.expression.evaluate()] = this.value.evaluate());
  },
});

TcParser.rule("operand", "'[' _? expression _? ']'", {
  evaluate() {
    return this.parser.getStore()[this.expression.evaluate()];
  },
});

//*************************************************
//  LOOPING AND CONDITIONALS
TcParser.rule("operand", "'while' _ test:expression _ 'do' _ body:expression", {
  evaluate() {
    let last;
    while (this.test.evaluate()) last = this.body.evaluate();
    return last;
  },
});

TcParser.rule("operand", "'if' _ test:expression _ 'then' _ then:expression _ else?", {
  evaluate() {
    return this.test.evaluate() ? this.then.evaluate() : this.else?.expression.evaluate();
  },
});
TcParser.rule("else", "'else' _ expression");

//*************************************************
//  VARIABLES
TcParser.rule("identifier", /\w+/);
TcParser.rule("operand", "identifier _? '=' _? expression", {
  evaluate() {
    return (this.parser.getContext()[this.identifier.text] = this.expression.evaluate());
  },
});
TcParser.rule("operand", "identifier", {
  evaluate() {
    return this.parser.getContext()[this.identifier.text];
  },
});

module.exports = TcParser;
