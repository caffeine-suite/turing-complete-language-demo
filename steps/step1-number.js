class TcParser extends require("caffeine-eight").Parser {}

//*************************************************
//  SEQUENCING
TcParser.rule("root", "operand");

//*************************************************
//  ARITHMETIC
TcParser.rule("operand", /-?[0-9]+/);

//*************************************************
//  LOOPING AND CONDITIONALS

//*************************************************
//  MEMORY

//*************************************************
//  VARIABLES

TcParser.repl();
