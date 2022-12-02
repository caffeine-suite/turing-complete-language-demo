// 1. Parser Class & Export
class TcParser extends require("caffeine-eight").Parser {
  getStore() {
    return this.store || (this.store = []);
  }
}
module.exports = TcParser;

// 2. Root Rules
TcParser.rule("root", "expression extraExpression* _? ';'?", {
  evaluate() {
    let last = this.expression.evaluate();
    this.extraExpressions?.forEach(e => (last = e.expression.evaluate()));
    return last;
  },
});
TcParser.rule("extraExpression", "_? ';' _? expression");

// 3. Arithmetic Rules
TcParser.rule("expression", "operand _? operator:/<=|>=|==|!=|[-+*\\/<>]/ _? operand", {
  evaluate() {
    return eval(`(a, b) => a ${this.operator.text} b`)(this.operands[0].evaluate(), this.operands[1].evaluate());
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

// 4. Memory Rules
TcParser.rule("operand", "'[' _? expression _? ']' _? '=' _? value:expression", {
  evaluate() {
    return (this.parser.getStore()[this.expression.evaluate()] = this.value.evaluate());
  },
});

TcParser.rule("operand", "'[' _? expression _? ']' ", {
  evaluate() {
    return this.parser.getStore()[this.expression.evaluate()];
  },
});

// 5. While Rules
//   5a. TURING COMPLETE!
// 6. If Rules
// 7. Variable Rules

TcParser.repl();
