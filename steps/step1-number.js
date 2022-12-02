// 1. Parser Class & Export
class TcParser extends require("caffeine-eight").Parser {}
module.exports = TcParser;

// 2. Root Rules
TcParser.rule("root", /-?[0-9]+/);

// 3. Arithmetic Rules
//   3a. ADD TESTS
//   3b. ADD EVALUATION
//   3c. ADD SEQUENCES
// 4. Memory Rules
// 5. While Rules
//   5a. TURING COMPLETE!
// 6. If Rules
// 7. Variable Rules

TcParser.repl();
