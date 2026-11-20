/*
  Solutions and extra tests for every task step and every daily quest.
  solution: code used by the "Why??" explanation (never checked against).
  tests:    extra cases, run after the main check, LeetCode style:
    { inputs: [...], last: 'x' }        run the code with these inputs, last output line must be x
    { replace: [regex, text], expect }  run the code with a changed starting value
    { call: 'f(3)', expect }            run the code, then print(f(3)) and compare
*/
(() => {
  const ifTests = (v, big, small) => [
    { replace: [`^${v[0]}\\s*=\\s*\\S+`, `${v[0]} = ${v[1]}`], expect: big },
    { replace: [`^${v[0]}\\s*=\\s*\\S+`, `${v[0]} = ${v[2]}`], expect: small },
  ];
  const callTests = (fn, cases) => cases.map(([arg, out]) => ({ call: `${fn}(${arg})`, expect: out }));

  function lessons(L) {
    return {
      install: [
        { solution: `print("${L.hello}")` },
        { solution: 'print(5 * 6)' },
        { solution: 'print(7 + 3)' },
      ],
      print: [
        { solution: `print("${L.learning}")` },
        { solution: `print("${L.learning}")\nprint("${L.step2}")` },
        { solution: `print("${L.answer}", 6 * 7)` },
      ],
      vars: [
        { solution: 'x = 7\nprint(x)' },
        { solution: 'a = 5\nb = 8\nprint(a + b)', tests: [{ replace: ['^a\\s*=\\s*\\S+', 'a = 1'], expect: '9' }, { replace: ['^b\\s*=\\s*\\S+', 'b = 0'], expect: '5' }] },
        { solution: `${L.score} = 10\n${L.score} = ${L.score} + 5\nprint(${L.score})`, tests: [{ replace: [`^${L.score}\\s*=\\s*10`, `${L.score} = 0`], expect: '5' }, { replace: [`^${L.score}\\s*=\\s*10`, `${L.score} = 95`], expect: '100' }] },
      ],
      input: [
        { solution: `name = input("${L.askName}")\nprint("${L.hi},", name)`, tests: [{ inputs: [L.name2], last: `${L.askName}${L.name2}\n${L.hi}, ${L.name2}`.split('\n').pop() }, { inputs: ['Max'], last: `${L.hi}, Max` }] },
        { solution: `n = int(input("${L.askNum}"))\nprint(n * 2)`, tests: [{ inputs: ['5'], last: '10' }, { inputs: ['0'], last: '0' }, { inputs: ['-4'], last: '-8' }] },
        { solution: 'a = int(input())\nb = int(input())\nprint(a + b)', tests: [{ inputs: ['10', '20'], last: '30' }, { inputs: ['-1', '1'], last: '0' }] },
      ],
      if: [
        { solution: `x = 7\nif x > 5:\n    print("${L.bigger}")`, tests: [{ replace: ['^x\\s*=\\s*\\S+', 'x = 3'], expect: '' }, { replace: ['^x\\s*=\\s*\\S+', 'x = 6'], expect: L.bigger }] },
        { solution: `t = 30\nif t > 25:\n    print("${L.hot}")\nelse:\n    print("${L.cool}")`, tests: ifTests(['t', 26, 10], L.hot, L.cool) },
        { solution: `n = 4\nif n % 2 == 0:\n    print("${L.even}")\nelse:\n    print("${L.odd}")`, tests: ifTests(['n', 10, 7], L.even, L.odd).concat([{ replace: ['^n\\s*=\\s*\\S+', 'n = 0'], expect: L.even }]) },
      ],
      for: [
        { solution: `for i in range(3):\n    print("${L.hello3}")` },
        { solution: 'for n in range(1, 6):\n    print(n)' },
        { solution: `${L.total} = 0\nfor i in range(1, 11):\n    ${L.total} = ${L.total} + i\nprint(${L.total})` },
      ],
      lists: [
        { solution: `${L.colors} = [${L.colorList}]\nprint(${L.colors}[0])` },
        { solution: `${L.nums} = [1, 2]\n${L.nums}.append(3)\nprint(len(${L.nums}))`, tests: [{ replace: [`^${L.nums}\\s*=\\s*\\[[^\\]]*\\]`, `${L.nums} = []`], expect: '1' }, { replace: [`^${L.nums}\\s*=\\s*\\[[^\\]]*\\]`, `${L.nums} = [7, 7, 7, 7]`], expect: '5' }] },
        { solution: `${L.nums} = [4, 8, 15]\nprint(sum(${L.nums}))`, tests: [{ replace: [`^${L.nums}\\s*=\\s*\\[[^\\]]*\\]`, `${L.nums} = [1, 2, 3]`], expect: '6' }] },
      ],
      func: [
        { solution: `def ${L.helloFn}():\n    print("${L.hello}")\n\n${L.helloFn}()` },
        { solution: `def ${L.double}(n):\n    return n * 2\n\nprint(${L.double}(21))`, tests: callTests(L.double, [['0', '0'], ['-5', '-10'], ['100', '200']]) },
        { solution: `def ${L.square}(n):\n    return n * n\n\nprint(${L.square}(7))`, tests: callTests(L.square, [['0', '0'], ['-3', '9'], ['12', '144']]) },
      ],
    };
  }

  function daily(L) {
    return {
      easy: [
        { solution: 'print(10)\nprint(20)\nprint(30)' },
        { solution: `${L.age} = 12\nprint(${L.age} + 1)`, tests: [{ replace: [`^${L.age}\\s*=\\s*\\S+`, `${L.age} = 40`], expect: '41' }] },
        { solution: 'print("Python" * 3)' },
        { solution: 'print(100 - 37)' },
        { solution: `print(len("${L.school}"))` },
      ],
      medium: [
        { solution: 'for n in range(2, 11, 2):\n    print(n)' },
        { solution: `n = int(input("${L.numPrompt}"))\nif n > 5:\n    print("${L.big}")\nelse:\n    print("${L.small}")`, tests: [{ inputs: ['2'], last: L.small }, { inputs: ['6'], last: L.big }, { inputs: ['5'], last: L.small }] },
        { solution: `${L.nums} = [3, 9, 4]\nprint(max(${L.nums}))`, tests: [{ replace: [`^${L.nums}\\s*=\\s*\\[[^\\]]*\\]`, `${L.nums} = [1, 5, 2]`], expect: '5' }, { replace: [`^${L.nums}\\s*=\\s*\\[[^\\]]*\\]`, `${L.nums} = [-3, -1, -7]`], expect: '-1' }] },
        { solution: 'n = 5\nwhile n > 0:\n    print(n)\n    n = n - 1', tests: [{ replace: ['^n\\s*=\\s*\\S+', 'n = 2'], expect: '2\n1' }] },
        { solution: `def ${L.greet}(name):\n    return "${L.hi}, " + name\n\nprint(${L.greet}("Max"))`, tests: [{ call: `${L.greet}("Lea")`, expect: `${L.hi}, Lea` }, { call: `${L.greet}("Tom")`, expect: `${L.hi}, Tom` }] },
      ],
      hard: [
        { solution: 'for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)' },
        { solution: `${L.nums} = [5, 10, 15, 20]\n${L.total} = 0\nfor x in ${L.nums}:\n    ${L.total} = ${L.total} + x\nprint(${L.total})`, tests: [{ replace: [`^${L.nums}\\s*=\\s*\\[[^\\]]*\\]`, `${L.nums} = [1, 2, 3]`], expect: '6' }, { replace: [`^${L.nums}\\s*=\\s*\\[[^\\]]*\\]`, `${L.nums} = []`], expect: '0' }] },
        { solution: `def ${L.isEven}(n):\n    return n % 2 == 0\n\nprint(${L.isEven}(4))\nprint(${L.isEven}(7))`, tests: callTests(L.isEven, [['0', 'True'], ['13', 'False'], ['100', 'True']]) },
        { solution: `${L.word} = input("${L.wordPrompt}")\nprint(${L.word}[::-1])`, tests: [{ inputs: ['Python'], last: 'nohtyP' }, { inputs: ['abc'], last: 'cba' }] },
        { solution: 'for i in range(1, 6):\n    print(3, "x", i, "=", 3 * i)' },
      ],
    };
  }

  const RU = {
    hello: 'Привет', learning: 'Я учу Python', step2: 'Шаг 2', answer: 'Ответ:', score: 'score',
    askName: 'Как тебя зовут? ', name2: 'Лея', hi: 'Привет', askNum: 'Введи число: ',
    bigger: 'Больше', hot: 'Жарко', cool: 'Прохладно', even: 'Чётное', odd: 'Нечётное',
    hello3: 'Привет', total: 'total', colors: 'colors', colorList: '"красный", "зелёный", "синий"', nums: 'nums',
    helloFn: 'hello', double: 'double', square: 'square',
    age: 'age', school: 'школа', numPrompt: 'Число: ', big: 'большое', small: 'маленькое', greet: 'greet', isEven: 'is_even', word: 'word', wordPrompt: 'Слово: ',
  };
  const EN = {
    hello: 'Hello', learning: 'I am learning Python', step2: 'Step 2', answer: 'Answer:', score: 'score',
    askName: 'What is your name? ', name2: 'Lea', hi: 'Hi', askNum: 'Enter a number: ',
    bigger: 'Bigger', hot: 'Hot', cool: 'Cool', even: 'Even', odd: 'Odd',
    hello3: 'Hi', total: 'total', colors: 'colors', colorList: '"red", "green", "blue"', nums: 'nums',
    helloFn: 'hello', double: 'double', square: 'square',
    age: 'age', school: 'school', numPrompt: 'Number: ', big: 'big', small: 'small', greet: 'greet', isEven: 'is_even', word: 'word', wordPrompt: 'Word: ',
  };
  const DE = {
    hello: 'Hallo', learning: 'Ich lerne Python', step2: 'Schritt 2', answer: 'Antwort:', score: 'punkte',
    askName: 'Wie heißt du? ', name2: 'Lea', hi: 'Hallo', askNum: 'Gib eine Zahl ein: ',
    bigger: 'Größer', hot: 'Heiß', cool: 'Kühl', even: 'Gerade', odd: 'Ungerade',
    hello3: 'Hallo', total: 'summe', colors: 'farben', colorList: '"rot", "grün", "blau"', nums: 'zahlen',
    helloFn: 'hallo', double: 'doppelt', square: 'quadrat',
    age: 'alter', school: 'Schule', numPrompt: 'Zahl: ', big: 'groß', small: 'klein', greet: 'gruss', isEven: 'ist_gerade', word: 'wort', wordPrompt: 'Wort: ',
  };
  /* the daily quests in English and Russian use "nums"/"total"; German uses "zahlen"/"summe" */
  window.TASK_EXTRAS = {
    ru: { lessons: lessons(RU), daily: daily(RU) },
    en: { lessons: lessons(EN), daily: daily(EN) },
    de: { lessons: lessons(DE), daily: daily(DE) },
  };
})();
