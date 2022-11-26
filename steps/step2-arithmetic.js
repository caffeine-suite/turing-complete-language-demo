class TcParser extends require("caffeine-eight").Parser {}

//*************************************************
//  SEQUENCING
TcParser.rule("root", "expression");

//*************************************************
//  ARITHMETIC
TcParser.rule("expression", "operand _? op:/==|!=|<=|>=|[-+*\\/<>]/ _? operand");
TcParser.rule("expression", "operand");
TcParser.rule("operand", "'(' _? root _? ')'");
TcParser.rule("operand", /-?[0-9]+/);
TcParser.rule("_", /\s+/);

//*************************************************
//  MEMORY

//*************************************************
//  LOOPING AND CONDITIONALS

//*************************************************
//  VARIABLES

TcParser.repl();
