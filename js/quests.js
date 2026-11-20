/*
  Quests.
  daily:    pools of tasks per level; each day one task per level is picked by the date.
            Task fields as in tasks.js, plus forbid: [{ re, hint }] (patterns that must NOT appear).
  quiz:     three questions per chapter (lesson id). answer is the index of the right option.
  projects: ideas per level. needs = lesson ids, starter = code that opens in the sandbox.
*/
window.QUESTS = {
  ru: {
    daily: {
      easy: [
        { text: 'Выведи числа <code>10</code>, <code>20</code> и <code>30</code>, каждое на своей строке.', starter: '', expect: '10\n20\n30', hint: 'Три команды <code>print</code>.' },
        { text: 'Положи <code>12</code> в переменную <code>age</code> и выведи <code>age + 1</code>.', starter: '', expect: '13', must: [{ re: '\\bage\\s*=', hint: 'Сначала создай переменную <code>age</code>.' }], hint: '<code>age = 12</code>, потом <code>print(age + 1)</code>.' },
        { text: 'Выведи слово <code>Python</code> три раза подряд в одной строке с помощью <code>*</code>.', starter: '', expect: 'PythonPythonPython', must: [{ re: '\\*\\s*3', hint: 'Строку можно умножить: <code>"Python" * 3</code>.' }], hint: '<code>print("Python" * 3)</code>' },
        { text: 'Пусть Python посчитает <code>100 - 37</code>.', starter: 'print()\n', expect: '63', must: [{ re: '-', hint: 'Напиши в скобках <code>100 - 37</code>.' }], hint: '<code>print(100 - 37)</code>' },
        { text: 'Выведи длину слова <code>"школа"</code> с помощью <code>len</code>.', starter: '', expect: '5', must: [{ re: 'len\\s*\\(', hint: 'Длину считает <code>len(...)</code>.' }], hint: '<code>print(len("школа"))</code>' },
      ],
      medium: [
        { text: 'Выведи чётные числа от 2 до 10 циклом <code>for</code>.', starter: '', expect: '2\n4\n6\n8\n10', must: [{ re: '\\bfor\\b', hint: 'Нужен цикл <code>for</code>.' }], hint: '<code>range(2, 11, 2)</code> идёт шагом 2.' },
        { text: 'Спроси число. Если оно больше 5, выведи <code>большое</code>, иначе <code>маленькое</code>. Проверка введёт 7.', starter: 'n = int(input("Число: "))\n', inputs: ['7'], includes: 'большое', must: [{ re: '\\bif\\b', hint: 'Нужен <code>if</code>.' }, { re: '\\belse\\b', hint: 'Добавь <code>else</code>.' }], hint: '<code>if n &gt; 5:</code>' },
        { text: 'Есть список <code>[3, 9, 4]</code>. Выведи самое большое число через <code>max</code>.', starter: 'nums = [3, 9, 4]\n', expect: '9', must: [{ re: 'max\\s*\\(', hint: 'Используй <code>max(nums)</code>.' }], hint: '<code>print(max(nums))</code>' },
        { text: 'Обратный отсчёт: выведи 5, 4, 3, 2, 1 циклом <code>while</code>.', starter: 'n = 5\n', expect: '5\n4\n3\n2\n1', must: [{ re: '\\bwhile\\b', hint: 'Нужен цикл <code>while</code>.' }], hint: '<code>while n &gt; 0:</code>, внутри print и <code>n = n - 1</code>.' },
        { text: 'Функция <code>greet(name)</code> возвращает <code>"Привет, " + name</code>. Выведи <code>greet("Макс")</code>.', starter: 'def greet(name):\n    \n', expect: 'Привет, Макс', must: [{ re: '\\breturn\\b', hint: 'Результат отдаёт <code>return</code>.' }], hint: '<code>return "Привет, " + name</code>' },
      ],
      hard: [
        { text: 'FizzBuzz: числа от 1 до 15, но вместо кратных 3 пиши <code>Fizz</code>, кратных 5 <code>Buzz</code>, кратных обоим <code>FizzBuzz</code>.', starter: '', expect: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', must: [{ re: '\\bfor\\b', hint: 'Нужен цикл <code>for</code>.' }, { re: '%', hint: 'Кратность проверяет <code>%</code>.' }], hint: 'Сначала проверь <code>i % 15 == 0</code>, потом 3 и 5 через <code>elif</code>.' },
        { text: 'Посчитай сумму списка <code>[5, 10, 15, 20]</code> циклом, без <code>sum</code>.', starter: 'nums = [5, 10, 15, 20]\ntotal = 0\n', expect: '50', must: [{ re: '\\bfor\\b', hint: 'Пройди по списку циклом <code>for</code>.' }], forbid: [{ re: 'sum\\s*\\(', hint: 'Здесь без <code>sum()</code>: сложи сам в цикле.' }], hint: '<code>for x in nums: total = total + x</code>' },
        { text: 'Функция <code>is_even(n)</code> возвращает <code>True</code> или <code>False</code>. Выведи <code>is_even(4)</code> и <code>is_even(7)</code>.', starter: 'def is_even(n):\n    \n', expect: 'True\nFalse', must: [{ re: '\\breturn\\b', hint: 'Нужен <code>return</code>.' }], hint: '<code>return n % 2 == 0</code>' },
        { text: 'Спроси слово и выведи его задом наперёд. Проверка введёт <code>Anna</code>.', starter: 'word = input("Слово: ")\n', inputs: ['Anna'], includes: 'annA', hint: '<code>word[::-1]</code> переворачивает строку.' },
        { text: 'Таблица умножения на 3: строки <code>3 x 1 = 3</code> … <code>3 x 5 = 15</code>.', starter: '', expect: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15', must: [{ re: '\\bfor\\b', hint: 'Нужен цикл <code>for</code>.' }], hint: '<code>print(3, "x", i, "=", 3 * i)</code>' },
      ],
    },
    quiz: {
      install: [
        { q: 'В каком окне IDLE виден результат программы?', options: ['Shell', 'Окно файла', 'Меню Run'], answer: 0, why: 'Shell показывает вывод, а после <code>&gt;&gt;&gt;</code> там можно вводить команды.' },
        { q: 'Что выведет этот код?', code: 'print(2 + 2)', options: ['4', '2 + 2', '22'], answer: 0, why: 'Без кавычек Python считает пример.' },
        { q: 'Какую галочку важно поставить при установке на Windows?', options: ['Add python.exe to PATH', 'Install for all users', 'Disable path length limit'], answer: 0, why: 'Без PATH терминал не найдёт Python.' },
      ],
      print: [
        { q: 'Что выведет этот код?', code: 'print("3 * 3")', options: ['3 * 3', '9', 'Ошибку'], answer: 0, why: 'В кавычках это текст, а не пример.' },
        { q: 'Что выведет этот код?', code: 'print("A", "B")', options: ['A B', 'AB', 'A, B'], answer: 0, why: 'print ставит пробел между кусками.' },
        { q: 'В какой строке ошибка?', options: ['Print("Hi")', 'print("Hi")', 'print(5)'], answer: 0, why: 'Python различает большие и маленькие буквы: нужно <code>print</code>.' },
      ],
      vars: [
        { q: 'Что выведет этот код?', code: 'x = 5\nx = x + 2\nprint(x)', options: ['7', '5', 'x + 2'], answer: 0, why: 'Берём 5, прибавляем 2 и кладём обратно в x.' },
        { q: 'Что выведет этот код?', code: 'name = "Макс"\nprint("name")', options: ['name', 'Макс', 'Ошибку'], answer: 0, why: 'В кавычках это слово name, а не переменная.' },
        { q: 'Что делает знак <code>=</code>?', options: ['Кладёт значение в переменную', 'Сравнивает два значения', 'Складывает числа'], answer: 0, why: 'Сравнивает <code>==</code>, а <code>=</code> сохраняет.' },
      ],
      input: [
        { q: 'Что возвращает <code>input()</code>?', options: ['Текст (строку)', 'Число', 'Список'], answer: 0, why: 'Даже цифры приходят текстом.' },
        { q: 'Человек вводит 5. Что выведет код?', code: 'a = input()\nprint(a + a)', options: ['55', '10', 'Ошибку'], answer: 0, why: '"5" + "5" склеивает текст.' },
        { q: 'Как получить число от пользователя?', options: ['int(input())', 'input(int())', 'number(input())'], answer: 0, why: 'Сначала input даёт текст, потом int делает из него число.' },
      ],
      if: [
        { q: 'Что выведет этот код?', code: 'x = 3\nif x > 5:\n    print("A")\nelse:\n    print("B")', options: ['B', 'A', 'A и B'], answer: 0, why: '3 не больше 5, поэтому работает else.' },
        { q: 'Какой знак проверяет равенство?', options: ['==', '=', '=>'], answer: 0, why: '<code>=</code> сохраняет, <code>==</code> сравнивает.' },
        { q: 'Чего не хватает в строке?', code: 'if x > 5', options: ['Двоеточия', 'Скобок', 'Кавычек'], answer: 0, why: 'После условия всегда ставят <code>:</code>.' },
      ],
      for: [
        { q: 'Что выведет этот код?', code: 'for i in range(3):\n    print(i)', options: ['0 1 2', '1 2 3', '0 1 2 3'], answer: 0, why: 'range(3) начинается с 0 и не включает 3.' },
        { q: 'Сколько раз выполнится цикл?', code: 'for i in range(2, 6):\n    print("Hi")', options: ['4', '6', '5'], answer: 0, why: '2, 3, 4, 5: четыре числа.' },
        { q: 'Когда выполнится строка без отступа после цикла?', options: ['Один раз после цикла', 'На каждом круге', 'Никогда'], answer: 0, why: 'Без отступа она уже не внутри цикла.' },
      ],
      lists: [
        { q: 'Что выведет этот код?', code: 'a = [4, 7, 9]\nprint(a[1])', options: ['7', '4', '9'], answer: 0, why: 'Счёт с нуля: [1] это второй элемент.' },
        { q: 'Что выведет этот код?', code: 'a = [1, 2]\na.append(5)\nprint(len(a))', options: ['3', '2', '5'], answer: 0, why: 'После append в списке три элемента.' },
        { q: 'Как взять последний элемент списка <code>[3, 8, 1]</code>?', options: ['[2]', '[3]', '[1]'], answer: 0, why: 'Три элемента: номера 0, 1 и 2.' },
      ],
      func: [
        { q: 'Что выведет этот код?', code: 'def f(x):\n    return x * 3\n\nprint(f(4))', options: ['12', '43', '7'], answer: 0, why: '4 * 3 = 12.' },
        { q: 'Что делает <code>return</code>?', options: ['Отдаёт результат функции', 'Печатает на экран', 'Запускает программу'], answer: 0, why: 'Печатает print, а return отдаёт значение.' },
        { q: 'Почему этот код ничего не выводит?', code: 'def hi():\n    print("Hi")', options: ['Функцию не вызвали', 'В коде ошибка', 'Не хватает print'], answer: 0, why: 'Нужно ещё написать <code>hi()</code>.' },
      ],
    },
    projects: {
      easy: [
        { title: 'Бот-приветствие', text: 'Спрашивает имя и любимый цвет, а потом отвечает дружелюбной фразой.', needs: ['print', 'vars', 'input'], starter: '# Бот-приветствие\nname = input("Как тебя зовут? ")\n# спроси любимый цвет\n# ответь фразой с именем и цветом\n' },
        { title: 'Мини-калькулятор', text: 'Берёт два числа и выводит их сумму, разность и произведение.', needs: ['input', 'vars'], starter: '# Мини-калькулятор\na = int(input("Первое число: "))\nb = int(input("Второе число: "))\n# выведи a + b, a - b и a * b\n' },
        { title: 'Возраст в днях', text: 'Спрашивает возраст и считает, сколько это примерно дней и часов.', needs: ['input', 'vars'], starter: '# Возраст в днях\nage = int(input("Сколько тебе лет? "))\n# дни: age * 365, часы: дни * 24\n' },
      ],
      medium: [
        { title: 'Угадай число', text: 'Компьютер загадывает число от 1 до 20, а ты угадываешь с подсказками «больше» и «меньше».', needs: ['input', 'if', 'for'], starter: '# Угадай число\nimport random\nsecret = random.randint(1, 20)\n# повторяй, пока не угадано: спроси число, подскажи больше или меньше\n' },
        { title: 'Список покупок', text: 'Добавляет товары, пока не введёшь «стоп», потом печатает весь список с номерами.', needs: ['lists', 'input', 'for'], starter: '# Список покупок\nitems = []\n# спрашивай товары, пока не введут "стоп"\n# потом выведи список с номерами\n' },
        { title: 'Викторина', text: 'Три вопроса, за каждый правильный ответ +1 очко, в конце итог.', needs: ['input', 'if', 'vars'], starter: '# Викторина\nscore = 0\n# задай вопрос, сравни ответ, прибавь очко\n# в конце выведи счёт\n' },
      ],
      hard: [
        { title: 'Камень, ножницы, бумага', text: 'Игра против компьютера до двух побед, со счётом после каждого раунда.', needs: ['if', 'for', 'func', 'input'], starter: '# Камень, ножницы, бумага\nimport random\nchoices = ["камень", "ножницы", "бумага"]\n# функция winner(a, b) решает, кто победил\n' },
        { title: 'Проверка пароля', text: 'Проверяет длину, цифры и большие буквы и говорит, что улучшить.', needs: ['func', 'if', 'for'], starter: '# Проверка пароля\npassword = input("Пароль: ")\n# длина не меньше 8? есть цифра? есть большая буква?\n' },
        { title: 'Тренажёр слов', text: 'Спрашивает перевод слов из списка пар, считает ошибки и повторяет трудные.', needs: ['lists', 'for', 'func', 'input'], starter: '# Тренажёр слов\nwords = [["кот", "cat"], ["дом", "house"], ["вода", "water"]]\n# спроси каждое слово, считай ошибки\n' },
      ],
    },
  },

  en: {
    daily: {
      easy: [
        { text: 'Print the numbers <code>10</code>, <code>20</code> and <code>30</code>, each on its own line.', starter: '', expect: '10\n20\n30', hint: 'Three <code>print</code> commands.' },
        { text: 'Put <code>12</code> into a variable <code>age</code> and print <code>age + 1</code>.', starter: '', expect: '13', must: [{ re: '\\bage\\s*=', hint: 'First create the variable <code>age</code>.' }], hint: '<code>age = 12</code>, then <code>print(age + 1)</code>.' },
        { text: 'Print the word <code>Python</code> three times on one line using <code>*</code>.', starter: '', expect: 'PythonPythonPython', must: [{ re: '\\*\\s*3', hint: 'You can multiply text: <code>"Python" * 3</code>.' }], hint: '<code>print("Python" * 3)</code>' },
        { text: 'Let Python work out <code>100 - 37</code>.', starter: 'print()\n', expect: '63', must: [{ re: '-', hint: 'Write <code>100 - 37</code> in the brackets.' }], hint: '<code>print(100 - 37)</code>' },
        { text: 'Print the length of the word <code>"school"</code> with <code>len</code>.', starter: '', expect: '6', must: [{ re: 'len\\s*\\(', hint: '<code>len(...)</code> counts the length.' }], hint: '<code>print(len("school"))</code>' },
      ],
      medium: [
        { text: 'Print the even numbers from 2 to 10 with a <code>for</code> loop.', starter: '', expect: '2\n4\n6\n8\n10', must: [{ re: '\\bfor\\b', hint: 'Use a <code>for</code> loop.' }], hint: '<code>range(2, 11, 2)</code> counts in steps of 2.' },
        { text: 'Ask for a number. If it is greater than 5 print <code>big</code>, otherwise <code>small</code>. The check types 7.', starter: 'n = int(input("Number: "))\n', inputs: ['7'], includes: 'big', must: [{ re: '\\bif\\b', hint: 'Use <code>if</code>.' }, { re: '\\belse\\b', hint: 'Add <code>else</code>.' }], hint: '<code>if n &gt; 5:</code>' },
        { text: 'There is a list <code>[3, 9, 4]</code>. Print the biggest number using <code>max</code>.', starter: 'nums = [3, 9, 4]\n', expect: '9', must: [{ re: 'max\\s*\\(', hint: 'Use <code>max(nums)</code>.' }], hint: '<code>print(max(nums))</code>' },
        { text: 'Countdown: print 5, 4, 3, 2, 1 with a <code>while</code> loop.', starter: 'n = 5\n', expect: '5\n4\n3\n2\n1', must: [{ re: '\\bwhile\\b', hint: 'Use a <code>while</code> loop.' }], hint: '<code>while n &gt; 0:</code>, inside print and <code>n = n - 1</code>.' },
        { text: 'The function <code>greet(name)</code> returns <code>"Hi, " + name</code>. Print <code>greet("Max")</code>.', starter: 'def greet(name):\n    \n', expect: 'Hi, Max', must: [{ re: '\\breturn\\b', hint: '<code>return</code> hands back the result.' }], hint: '<code>return "Hi, " + name</code>' },
      ],
      hard: [
        { text: 'FizzBuzz: numbers 1 to 15, but write <code>Fizz</code> for multiples of 3, <code>Buzz</code> for multiples of 5 and <code>FizzBuzz</code> for both.', starter: '', expect: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', must: [{ re: '\\bfor\\b', hint: 'Use a <code>for</code> loop.' }, { re: '%', hint: '<code>%</code> checks for multiples.' }], hint: 'Check <code>i % 15 == 0</code> first, then 3 and 5 with <code>elif</code>.' },
        { text: 'Add up the list <code>[5, 10, 15, 20]</code> with a loop, without <code>sum</code>.', starter: 'nums = [5, 10, 15, 20]\ntotal = 0\n', expect: '50', must: [{ re: '\\bfor\\b', hint: 'Go through the list with <code>for</code>.' }], forbid: [{ re: 'sum\\s*\\(', hint: 'No <code>sum()</code> here: add it up yourself in the loop.' }], hint: '<code>for x in nums: total = total + x</code>' },
        { text: 'The function <code>is_even(n)</code> returns <code>True</code> or <code>False</code>. Print <code>is_even(4)</code> and <code>is_even(7)</code>.', starter: 'def is_even(n):\n    \n', expect: 'True\nFalse', must: [{ re: '\\breturn\\b', hint: 'You need <code>return</code>.' }], hint: '<code>return n % 2 == 0</code>' },
        { text: 'Ask for a word and print it backwards. The check types <code>Anna</code>.', starter: 'word = input("Word: ")\n', inputs: ['Anna'], includes: 'annA', hint: '<code>word[::-1]</code> reverses a string.' },
        { text: 'Times table of 3: lines <code>3 x 1 = 3</code> … <code>3 x 5 = 15</code>.', starter: '', expect: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15', must: [{ re: '\\bfor\\b', hint: 'Use a <code>for</code> loop.' }], hint: '<code>print(3, "x", i, "=", 3 * i)</code>' },
      ],
    },
    quiz: {
      install: [
        { q: 'Which IDLE window shows the program\'s result?', options: ['Shell', 'File window', 'Run menu'], answer: 0, why: 'The Shell shows the output, and after <code>&gt;&gt;&gt;</code> you can type commands.' },
        { q: 'What does this print?', code: 'print(2 + 2)', options: ['4', '2 + 2', '22'], answer: 0, why: 'Without quotes Python does the maths.' },
        { q: 'Which checkbox matters when installing on Windows?', options: ['Add python.exe to PATH', 'Install for all users', 'Disable path length limit'], answer: 0, why: 'Without PATH the terminal will not find Python.' },
      ],
      print: [
        { q: 'What does this print?', code: 'print("3 * 3")', options: ['3 * 3', '9', 'An error'], answer: 0, why: 'In quotes it is text, not maths.' },
        { q: 'What does this print?', code: 'print("A", "B")', options: ['A B', 'AB', 'A, B'], answer: 0, why: 'print puts a space between the pieces.' },
        { q: 'Which line has an error?', options: ['Print("Hi")', 'print("Hi")', 'print(5)'], answer: 0, why: 'Python is case-sensitive: it must be <code>print</code>.' },
      ],
      vars: [
        { q: 'What does this print?', code: 'x = 5\nx = x + 2\nprint(x)', options: ['7', '5', 'x + 2'], answer: 0, why: 'Take 5, add 2 and put it back into x.' },
        { q: 'What does this print?', code: 'name = "Max"\nprint("name")', options: ['name', 'Max', 'An error'], answer: 0, why: 'In quotes it is the word name, not the variable.' },
        { q: 'What does <code>=</code> do?', options: ['Puts a value into a variable', 'Compares two values', 'Adds numbers'], answer: 0, why: '<code>==</code> compares, <code>=</code> stores.' },
      ],
      input: [
        { q: 'What does <code>input()</code> give back?', options: ['Text (a string)', 'A number', 'A list'], answer: 0, why: 'Even digits arrive as text.' },
        { q: 'Someone types 5. What does this print?', code: 'a = input()\nprint(a + a)', options: ['55', '10', 'An error'], answer: 0, why: '"5" + "5" glues the text together.' },
        { q: 'How do you get a number from the user?', options: ['int(input())', 'input(int())', 'number(input())'], answer: 0, why: 'input gives text, then int turns it into a number.' },
      ],
      if: [
        { q: 'What does this print?', code: 'x = 3\nif x > 5:\n    print("A")\nelse:\n    print("B")', options: ['B', 'A', 'A and B'], answer: 0, why: '3 is not greater than 5, so else runs.' },
        { q: 'Which sign checks for equality?', options: ['==', '=', '=>'], answer: 0, why: '<code>=</code> stores, <code>==</code> compares.' },
        { q: 'What is missing in this line?', code: 'if x > 5', options: ['A colon', 'Brackets', 'Quotes'], answer: 0, why: 'A condition always ends with <code>:</code>.' },
      ],
      for: [
        { q: 'What does this print?', code: 'for i in range(3):\n    print(i)', options: ['0 1 2', '1 2 3', '0 1 2 3'], answer: 0, why: 'range(3) starts at 0 and stops before 3.' },
        { q: 'How many times does the loop run?', code: 'for i in range(2, 6):\n    print("Hi")', options: ['4', '6', '5'], answer: 0, why: '2, 3, 4, 5: four numbers.' },
        { q: 'When does an unindented line after the loop run?', options: ['Once, after the loop', 'Every round', 'Never'], answer: 0, why: 'Without indentation it is no longer inside the loop.' },
      ],
      lists: [
        { q: 'What does this print?', code: 'a = [4, 7, 9]\nprint(a[1])', options: ['7', '4', '9'], answer: 0, why: 'Counting starts at zero: [1] is the second item.' },
        { q: 'What does this print?', code: 'a = [1, 2]\na.append(5)\nprint(len(a))', options: ['3', '2', '5'], answer: 0, why: 'After append the list has three items.' },
        { q: 'How do you get the last item of <code>[3, 8, 1]</code>?', options: ['[2]', '[3]', '[1]'], answer: 0, why: 'Three items: positions 0, 1 and 2.' },
      ],
      func: [
        { q: 'What does this print?', code: 'def f(x):\n    return x * 3\n\nprint(f(4))', options: ['12', '43', '7'], answer: 0, why: '4 * 3 = 12.' },
        { q: 'What does <code>return</code> do?', options: ['Hands back the result', 'Prints to the screen', 'Starts the program'], answer: 0, why: 'print shows things, return gives a value back.' },
        { q: 'Why does this code print nothing?', code: 'def hi():\n    print("Hi")', options: ['The function is never called', 'There is an error', 'print is missing'], answer: 0, why: 'You still need to write <code>hi()</code>.' },
      ],
    },
    projects: {
      easy: [
        { title: 'Greeting bot', text: 'Asks for a name and a favourite colour, then answers with a friendly sentence.', needs: ['print', 'vars', 'input'], starter: '# Greeting bot\nname = input("What is your name? ")\n# ask for a favourite colour\n# answer with the name and the colour\n' },
        { title: 'Mini calculator', text: 'Takes two numbers and prints their sum, difference and product.', needs: ['input', 'vars'], starter: '# Mini calculator\na = int(input("First number: "))\nb = int(input("Second number: "))\n# print a + b, a - b and a * b\n' },
        { title: 'Age in days', text: 'Asks for your age and works out roughly how many days and hours that is.', needs: ['input', 'vars'], starter: '# Age in days\nage = int(input("How old are you? "))\n# days: age * 365, hours: days * 24\n' },
      ],
      medium: [
        { title: 'Guess the number', text: 'The computer picks a number from 1 to 20 and you guess it with "higher" and "lower" hints.', needs: ['input', 'if', 'for'], starter: '# Guess the number\nimport random\nsecret = random.randint(1, 20)\n# repeat until guessed: ask, then say higher or lower\n' },
        { title: 'Shopping list', text: 'Adds items until you type "stop", then prints the whole list with numbers.', needs: ['lists', 'input', 'for'], starter: '# Shopping list\nitems = []\n# ask for items until someone types "stop"\n# then print the list with numbers\n' },
        { title: 'Quiz game', text: 'Three questions, one point per right answer, and the total at the end.', needs: ['input', 'if', 'vars'], starter: '# Quiz game\nscore = 0\n# ask a question, compare the answer, add a point\n# print the score at the end\n' },
      ],
      hard: [
        { title: 'Rock, paper, scissors', text: 'Play against the computer until someone wins twice, with the score after every round.', needs: ['if', 'for', 'func', 'input'], starter: '# Rock, paper, scissors\nimport random\nchoices = ["rock", "paper", "scissors"]\n# a function winner(a, b) decides who won\n' },
        { title: 'Password checker', text: 'Checks length, digits and capital letters and says what to improve.', needs: ['func', 'if', 'for'], starter: '# Password checker\npassword = input("Password: ")\n# at least 8 long? a digit? a capital letter?\n' },
        { title: 'Vocabulary trainer', text: 'Asks for translations from a list of word pairs, counts mistakes and repeats the hard ones.', needs: ['lists', 'for', 'func', 'input'], starter: '# Vocabulary trainer\nwords = [["Katze", "cat"], ["Haus", "house"], ["Wasser", "water"]]\n# ask every word, count mistakes\n' },
      ],
    },
  },

  de: {
    daily: {
      easy: [
        { text: 'Gib die Zahlen <code>10</code>, <code>20</code> und <code>30</code> aus, jede in einer eigenen Zeile.', starter: '', expect: '10\n20\n30', hint: 'Drei <code>print</code>-Befehle.' },
        { text: 'Leg <code>12</code> in die Variable <code>alter</code> und gib <code>alter + 1</code> aus.', starter: '', expect: '13', must: [{ re: '\\balter\\s*=', hint: 'Leg zuerst die Variable <code>alter</code> an.' }], hint: '<code>alter = 12</code>, dann <code>print(alter + 1)</code>.' },
        { text: 'Gib das Wort <code>Python</code> dreimal hintereinander in einer Zeile aus, mit <code>*</code>.', starter: '', expect: 'PythonPythonPython', must: [{ re: '\\*\\s*3', hint: 'Text kann man multiplizieren: <code>"Python" * 3</code>.' }], hint: '<code>print("Python" * 3)</code>' },
        { text: 'Lass Python <code>100 - 37</code> ausrechnen.', starter: 'print()\n', expect: '63', must: [{ re: '-', hint: 'Schreib <code>100 - 37</code> in die Klammern.' }], hint: '<code>print(100 - 37)</code>' },
        { text: 'Gib die Länge des Worts <code>"Schule"</code> mit <code>len</code> aus.', starter: '', expect: '6', must: [{ re: 'len\\s*\\(', hint: '<code>len(...)</code> zählt die Länge.' }], hint: '<code>print(len("Schule"))</code>' },
      ],
      medium: [
        { text: 'Gib die geraden Zahlen von 2 bis 10 mit einer <code>for</code>-Schleife aus.', starter: '', expect: '2\n4\n6\n8\n10', must: [{ re: '\\bfor\\b', hint: 'Benutze eine <code>for</code>-Schleife.' }], hint: '<code>range(2, 11, 2)</code> zählt in Zweierschritten.' },
        { text: 'Frag nach einer Zahl. Ist sie größer als 5, gib <code>groß</code> aus, sonst <code>klein</code>. Die Prüfung tippt 7.', starter: 'n = int(input("Zahl: "))\n', inputs: ['7'], includes: 'groß', must: [{ re: '\\bif\\b', hint: 'Benutze <code>if</code>.' }, { re: '\\belse\\b', hint: 'Füg <code>else</code> hinzu.' }], hint: '<code>if n &gt; 5:</code>' },
        { text: 'Es gibt die Liste <code>[3, 9, 4]</code>. Gib die größte Zahl mit <code>max</code> aus.', starter: 'zahlen = [3, 9, 4]\n', expect: '9', must: [{ re: 'max\\s*\\(', hint: 'Benutze <code>max(zahlen)</code>.' }], hint: '<code>print(max(zahlen))</code>' },
        { text: 'Countdown: gib 5, 4, 3, 2, 1 mit einer <code>while</code>-Schleife aus.', starter: 'n = 5\n', expect: '5\n4\n3\n2\n1', must: [{ re: '\\bwhile\\b', hint: 'Benutze eine <code>while</code>-Schleife.' }], hint: '<code>while n &gt; 0:</code>, darin print und <code>n = n - 1</code>.' },
        { text: 'Die Funktion <code>gruss(name)</code> gibt <code>"Hallo, " + name</code> zurück. Gib <code>gruss("Max")</code> aus.', starter: 'def gruss(name):\n    \n', expect: 'Hallo, Max', must: [{ re: '\\breturn\\b', hint: '<code>return</code> gibt das Ergebnis zurück.' }], hint: '<code>return "Hallo, " + name</code>' },
      ],
      hard: [
        { text: 'FizzBuzz: Zahlen von 1 bis 15, aber statt Vielfachen von 3 <code>Fizz</code>, von 5 <code>Buzz</code> und von beiden <code>FizzBuzz</code>.', starter: '', expect: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', must: [{ re: '\\bfor\\b', hint: 'Benutze eine <code>for</code>-Schleife.' }, { re: '%', hint: '<code>%</code> prüft Vielfache.' }], hint: 'Prüf zuerst <code>i % 15 == 0</code>, dann 3 und 5 mit <code>elif</code>.' },
        { text: 'Addiere die Liste <code>[5, 10, 15, 20]</code> mit einer Schleife, ohne <code>sum</code>.', starter: 'zahlen = [5, 10, 15, 20]\nsumme = 0\n', expect: '50', must: [{ re: '\\bfor\\b', hint: 'Geh mit <code>for</code> durch die Liste.' }], forbid: [{ re: 'sum\\s*\\(', hint: 'Hier ohne <code>sum()</code>: rechne selbst in der Schleife.' }], hint: '<code>for x in zahlen: summe = summe + x</code>' },
        { text: 'Die Funktion <code>ist_gerade(n)</code> gibt <code>True</code> oder <code>False</code> zurück. Gib <code>ist_gerade(4)</code> und <code>ist_gerade(7)</code> aus.', starter: 'def ist_gerade(n):\n    \n', expect: 'True\nFalse', must: [{ re: '\\breturn\\b', hint: 'Du brauchst <code>return</code>.' }], hint: '<code>return n % 2 == 0</code>' },
        { text: 'Frag nach einem Wort und gib es rückwärts aus. Die Prüfung tippt <code>Anna</code>.', starter: 'wort = input("Wort: ")\n', inputs: ['Anna'], includes: 'annA', hint: '<code>wort[::-1]</code> dreht einen String um.' },
        { text: 'Dreier-Einmaleins: Zeilen <code>3 x 1 = 3</code> … <code>3 x 5 = 15</code>.', starter: '', expect: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15', must: [{ re: '\\bfor\\b', hint: 'Benutze eine <code>for</code>-Schleife.' }], hint: '<code>print(3, "x", i, "=", 3 * i)</code>' },
      ],
    },
    quiz: {
      install: [
        { q: 'In welchem IDLE-Fenster siehst du das Ergebnis?', options: ['Shell', 'Dateifenster', 'Menü Run'], answer: 0, why: 'Die Shell zeigt die Ausgabe, und nach <code>&gt;&gt;&gt;</code> kannst du Befehle tippen.' },
        { q: 'Was gibt dieser Code aus?', code: 'print(2 + 2)', options: ['4', '2 + 2', '22'], answer: 0, why: 'Ohne Anführungszeichen rechnet Python.' },
        { q: 'Welches Häkchen ist bei der Installation unter Windows wichtig?', options: ['Add python.exe to PATH', 'Install for all users', 'Disable path length limit'], answer: 0, why: 'Ohne PATH findet das Terminal Python nicht.' },
      ],
      print: [
        { q: 'Was gibt dieser Code aus?', code: 'print("3 * 3")', options: ['3 * 3', '9', 'Einen Fehler'], answer: 0, why: 'In Anführungszeichen ist es Text, keine Rechnung.' },
        { q: 'Was gibt dieser Code aus?', code: 'print("A", "B")', options: ['A B', 'AB', 'A, B'], answer: 0, why: 'print setzt ein Leerzeichen zwischen die Teile.' },
        { q: 'In welcher Zeile ist ein Fehler?', options: ['Print("Hi")', 'print("Hi")', 'print(5)'], answer: 0, why: 'Python unterscheidet Groß und Klein: richtig ist <code>print</code>.' },
      ],
      vars: [
        { q: 'Was gibt dieser Code aus?', code: 'x = 5\nx = x + 2\nprint(x)', options: ['7', '5', 'x + 2'], answer: 0, why: '5 nehmen, 2 dazu und zurück in x legen.' },
        { q: 'Was gibt dieser Code aus?', code: 'name = "Max"\nprint("name")', options: ['name', 'Max', 'Einen Fehler'], answer: 0, why: 'In Anführungszeichen ist es das Wort name, nicht die Variable.' },
        { q: 'Was macht <code>=</code>?', options: ['Legt einen Wert in eine Variable', 'Vergleicht zwei Werte', 'Addiert Zahlen'], answer: 0, why: '<code>==</code> vergleicht, <code>=</code> speichert.' },
      ],
      input: [
        { q: 'Was liefert <code>input()</code>?', options: ['Text (einen String)', 'Eine Zahl', 'Eine Liste'], answer: 0, why: 'Auch Ziffern kommen als Text an.' },
        { q: 'Jemand tippt 5. Was gibt der Code aus?', code: 'a = input()\nprint(a + a)', options: ['55', '10', 'Einen Fehler'], answer: 0, why: '"5" + "5" klebt Text zusammen.' },
        { q: 'Wie bekommst du eine Zahl vom Nutzer?', options: ['int(input())', 'input(int())', 'number(input())'], answer: 0, why: 'input liefert Text, int macht daraus eine Zahl.' },
      ],
      if: [
        { q: 'Was gibt dieser Code aus?', code: 'x = 3\nif x > 5:\n    print("A")\nelse:\n    print("B")', options: ['B', 'A', 'A und B'], answer: 0, why: '3 ist nicht größer als 5, also läuft else.' },
        { q: 'Welches Zeichen prüft auf Gleichheit?', options: ['==', '=', '=>'], answer: 0, why: '<code>=</code> speichert, <code>==</code> vergleicht.' },
        { q: 'Was fehlt in dieser Zeile?', code: 'if x > 5', options: ['Ein Doppelpunkt', 'Klammern', 'Anführungszeichen'], answer: 0, why: 'Nach einer Bedingung kommt immer <code>:</code>.' },
      ],
      for: [
        { q: 'Was gibt dieser Code aus?', code: 'for i in range(3):\n    print(i)', options: ['0 1 2', '1 2 3', '0 1 2 3'], answer: 0, why: 'range(3) fängt bei 0 an und hört vor 3 auf.' },
        { q: 'Wie oft läuft die Schleife?', code: 'for i in range(2, 6):\n    print("Hi")', options: ['4', '6', '5'], answer: 0, why: '2, 3, 4, 5: vier Zahlen.' },
        { q: 'Wann läuft eine Zeile ohne Einrückung nach der Schleife?', options: ['Einmal nach der Schleife', 'In jeder Runde', 'Nie'], answer: 0, why: 'Ohne Einrückung gehört sie nicht mehr zur Schleife.' },
      ],
      lists: [
        { q: 'Was gibt dieser Code aus?', code: 'a = [4, 7, 9]\nprint(a[1])', options: ['7', '4', '9'], answer: 0, why: 'Gezählt wird ab null: [1] ist das zweite Element.' },
        { q: 'Was gibt dieser Code aus?', code: 'a = [1, 2]\na.append(5)\nprint(len(a))', options: ['3', '2', '5'], answer: 0, why: 'Nach append sind drei Elemente drin.' },
        { q: 'Wie bekommst du das letzte Element von <code>[3, 8, 1]</code>?', options: ['[2]', '[3]', '[1]'], answer: 0, why: 'Drei Elemente: Positionen 0, 1 und 2.' },
      ],
      func: [
        { q: 'Was gibt dieser Code aus?', code: 'def f(x):\n    return x * 3\n\nprint(f(4))', options: ['12', '43', '7'], answer: 0, why: '4 * 3 = 12.' },
        { q: 'Was macht <code>return</code>?', options: ['Gibt das Ergebnis zurück', 'Schreibt auf den Bildschirm', 'Startet das Programm'], answer: 0, why: 'print zeigt etwas an, return gibt einen Wert zurück.' },
        { q: 'Warum gibt dieser Code nichts aus?', code: 'def hi():\n    print("Hi")', options: ['Die Funktion wird nie aufgerufen', 'Es gibt einen Fehler', 'print fehlt'], answer: 0, why: 'Es fehlt noch <code>hi()</code>.' },
      ],
    },
    projects: {
      easy: [
        { title: 'Begrüßungs-Bot', text: 'Fragt nach Namen und Lieblingsfarbe und antwortet mit einem freundlichen Satz.', needs: ['print', 'vars', 'input'], starter: '# Begrüßungs-Bot\nname = input("Wie heißt du? ")\n# frag nach der Lieblingsfarbe\n# antworte mit Name und Farbe\n' },
        { title: 'Mini-Rechner', text: 'Nimmt zwei Zahlen und gibt Summe, Differenz und Produkt aus.', needs: ['input', 'vars'], starter: '# Mini-Rechner\na = int(input("Erste Zahl: "))\nb = int(input("Zweite Zahl: "))\n# gib a + b, a - b und a * b aus\n' },
        { title: 'Alter in Tagen', text: 'Fragt nach dem Alter und rechnet ungefähr aus, wie viele Tage und Stunden das sind.', needs: ['input', 'vars'], starter: '# Alter in Tagen\nalter = int(input("Wie alt bist du? "))\n# Tage: alter * 365, Stunden: Tage * 24\n' },
      ],
      medium: [
        { title: 'Zahlenraten', text: 'Der Computer denkt sich eine Zahl von 1 bis 20 aus, du rätst mit den Tipps „größer“ und „kleiner“.', needs: ['input', 'if', 'for'], starter: '# Zahlenraten\nimport random\ngeheim = random.randint(1, 20)\n# wiederholen bis erraten: fragen, dann größer oder kleiner sagen\n' },
        { title: 'Einkaufsliste', text: 'Fügt Sachen hinzu, bis du „stopp“ tippst, und gibt dann die ganze Liste nummeriert aus.', needs: ['lists', 'input', 'for'], starter: '# Einkaufsliste\nsachen = []\n# frag nach Sachen, bis jemand "stopp" tippt\n# dann die Liste mit Nummern ausgeben\n' },
        { title: 'Quiz-Spiel', text: 'Drei Fragen, ein Punkt pro richtiger Antwort, am Ende das Ergebnis.', needs: ['input', 'if', 'vars'], starter: '# Quiz-Spiel\npunkte = 0\n# Frage stellen, Antwort vergleichen, Punkt dazu\n# am Ende die Punkte ausgeben\n' },
      ],
      hard: [
        { title: 'Schere, Stein, Papier', text: 'Spiel gegen den Computer, bis jemand zweimal gewinnt, mit Spielstand nach jeder Runde.', needs: ['if', 'for', 'func', 'input'], starter: '# Schere, Stein, Papier\nimport random\nauswahl = ["schere", "stein", "papier"]\n# eine Funktion gewinner(a, b) entscheidet, wer gewonnen hat\n' },
        { title: 'Passwort-Prüfer', text: 'Prüft Länge, Ziffern und Großbuchstaben und sagt, was besser werden kann.', needs: ['func', 'if', 'for'], starter: '# Passwort-Prüfer\npasswort = input("Passwort: ")\n# mindestens 8 Zeichen? eine Ziffer? ein Großbuchstabe?\n' },
        { title: 'Vokabeltrainer', text: 'Fragt Übersetzungen aus einer Liste von Wortpaaren ab, zählt Fehler und wiederholt die schweren.', needs: ['lists', 'for', 'func', 'input'], starter: '# Vokabeltrainer\nwoerter = [["Katze", "cat"], ["Haus", "house"], ["Wasser", "water"]]\n# jedes Wort abfragen, Fehler zählen\n' },
      ],
    },
  },
};
