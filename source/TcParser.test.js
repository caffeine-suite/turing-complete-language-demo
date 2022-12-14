const TcParser = require("./TcParser");

const tests = {
  "1 + 2": 3,
  "1 - 2": -1,
  "1 * 2": 2,
  "1 / 2": 0.5,
  "1 < 2": true,
  "1 <= 2": true,
  "1 > 2": false,
  "1 >= 2": false,
  "1 == 2": false,
  "1 != 2": true,
  "2 == 2": true,
  "3 * (4+5)": 27,
  "1;2;3": 3,
  "[4]=5; [4]": 5,
  "[0]=4;[1]=1;while [0] > 0 do ([0] = [0] - 1; [1] = [1] * 2)": 16,
  "if 1 then 2 else 3": 2,
  "if 0 then 2 else 3": 3,
  "a = 123; a + 10": 133,
  "i = 4; s = 1; while i > 0 do (i = i - 1; s = s * 2)": 16,
};

for (const program in tests) {
  const expected = tests[program];
  test(`${program} >>> ${expected}`, () => {
    expect(TcParser.parse(program).evaluate()).toEqual(expected);
  });
}
