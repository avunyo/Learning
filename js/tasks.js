/*
  Step-by-step tasks: every lesson has three small steps, from easy to the real task.
  Each step: { text, starter, expect | includes, inputs, must: [{ re, hint }], hint }.
  The lesson counts as done when its last step is solved.
*/
window.TASKS = {
  ru: {
    install: [
      { text: 'Выведи на экран слово <code>Привет</code>.', starter: 'print()\n', expect: 'Привет', hint: 'Текст в кавычках внутри скобок: <code>print("Привет")</code>.' },
      { text: 'Пусть Python сам посчитает <code>5 * 6</code>.', starter: 'print()\n', expect: '30', must: [{ re: '\\*', hint: 'Посчитать должен Python: напиши в скобках <code>5 * 6</code>.' }], hint: '<code>print(5 * 6)</code>' },
      { text: 'А теперь <code>7 + 3</code>, и снова без готового ответа.', starter: 'print()\n', expect: '10', must: [{ re: '\\+', hint: 'Напиши в скобках именно <code>7 + 3</code>.' }], hint: '<code>print(7 + 3)</code>' },
    ],
    print: [
      { text: 'Выведи одну строку: <code>Я учу Python</code>.', starter: '', expect: 'Я учу Python', hint: '<code>print("Я учу Python")</code>' },
      { text: 'Две строки: сначала <code>Я учу Python</code>, под ней <code>Шаг 2</code>.', starter: '', expect: 'Я учу Python\nШаг 2', hint: 'Две команды <code>print</code>, каждая на своей строке.' },
      { text: 'Через запятую выведи текст <code>Ответ:</code> и результат <code>6 * 7</code>.', starter: '', expect: 'Ответ: 42', must: [{ re: ',', hint: 'Раздели два куска запятой внутри скобок.' }, { re: '\\*', hint: 'Число пусть посчитает Python: <code>6 * 7</code>.' }], hint: '<code>print("Ответ:", 6 * 7)</code>' },
    ],
    vars: [
      { text: 'Создай переменную <code>x</code> со значением <code>7</code> и выведи её.', starter: '', expect: '7', must: [{ re: '\\bx\\s*=\\s*7', hint: 'Сначала <code>x = 7</code>.' }, { re: 'print\\s*\\(\\s*x\\s*\\)', hint: 'Выводи переменную без кавычек: <code>print(x)</code>.' }], hint: '<code>x = 7</code>, потом <code>print(x)</code>.' },
      { text: 'Есть <code>a = 5</code> и <code>b = 8</code>. Выведи их сумму через имена переменных.', starter: 'a = 5\nb = 8\n', expect: '13', must: [{ re: 'print\\s*\\(\\s*(a\\s*\\+\\s*b|b\\s*\\+\\s*a)', hint: 'Сложи сами переменные: <code>print(a + b)</code>.' }], hint: '<code>print(a + b)</code>' },
      { text: 'Есть <code>score = 10</code>. Увеличь <code>score</code> на 5 и выведи.', starter: 'score = 10\n', expect: '15', must: [{ re: 'score\\s*=\\s*score\\s*\\+\\s*5|score\\s*\\+=\\s*5', hint: 'Положи в <code>score</code> старое значение плюс 5.' }], hint: '<code>score = score + 5</code>, потом <code>print(score)</code>.' },
    ],
    input: [
      { text: 'Спроси имя через <code>input</code> и выведи <code>Привет,</code> и имя. Проверка введёт «Аня».', starter: 'name = input("Как тебя зовут? ")\n', inputs: ['Аня'], includes: 'Привет, Аня', must: [{ re: 'input\\s*\\(', hint: 'Имя нужно получить через <code>input</code>.' }], hint: '<code>print("Привет,", name)</code>' },
      { text: 'Спроси число и выведи его, умноженное на 2. Проверка введёт 21.', starter: 'n = int(input("Введи число: "))\n', inputs: ['21'], includes: '42', must: [{ re: 'input\\s*\\(', hint: 'Число нужно получить через <code>input</code>.' }], hint: '<code>print(n * 2)</code>' },
      { text: 'Спроси два числа и выведи их сумму. Проверка введёт 4 и 5.', starter: '', inputs: ['4', '5'], includes: '9', must: [{ re: 'input[\\s\\S]*input', hint: 'Нужно два раза спросить через <code>input</code>.' }, { re: 'int\\s*\\(', hint: 'Без <code>int()</code> получится «45», а не 9.' }], hint: '<code>a = int(input())</code>, <code>b = int(input())</code>, <code>print(a + b)</code>.' },
    ],
    if: [
      { text: 'Есть <code>x = 7</code>. Если <code>x</code> больше 5, выведи <code>Больше</code>.', starter: 'x = 7\n', expect: 'Больше', must: [{ re: '\\bif\\b', hint: 'Нужен <code>if</code>, а не просто print.' }], hint: '<code>if x &gt; 5:</code>, на следующей строке 4 пробела и print.' },
      { text: 'Есть <code>t = 30</code>. Если больше 25, выведи <code>Жарко</code>, иначе <code>Прохладно</code>.', starter: 't = 30\n', expect: 'Жарко', must: [{ re: '\\bif\\b', hint: 'Нужен <code>if</code>.' }, { re: '\\belse\\b', hint: 'Добавь ветку <code>else</code>.' }], hint: '<code>if t &gt; 25:</code> … <code>else:</code> …' },
      { text: 'Есть <code>n = 4</code>. Выведи <code>Чётное</code>, если <code>n % 2 == 0</code>, иначе <code>Нечётное</code>.', starter: 'n = 4\n', expect: 'Чётное', must: [{ re: '%', hint: '<code>%</code> даёт остаток от деления. У чётных он 0.' }, { re: '\\belse\\b', hint: 'Добавь ветку <code>else</code> для «Нечётное».' }], hint: '<code>if n % 2 == 0:</code>' },
    ],
    for: [
      { text: 'С помощью <code>for</code> выведи слово <code>Привет</code> три раза.', starter: '', expect: 'Привет\nПривет\nПривет', must: [{ re: '\\bfor\\b', hint: 'Нужен цикл <code>for</code>, а не три print.' }], hint: '<code>for i in range(3):</code> и внутри <code>print("Привет")</code>.' },
      { text: 'Выведи числа от 1 до 5, каждое на новой строке.', starter: '', expect: '1\n2\n3\n4\n5', must: [{ re: '\\bfor\\b', hint: 'Нужен цикл <code>for</code>.' }], hint: '<code>for n in range(1, 6):</code>' },
      { text: 'Посчитай циклом сумму чисел от 1 до 10 и выведи её.', starter: 'total = 0\n', expect: '55', must: [{ re: '\\bfor\\b', hint: 'Сложи числа в цикле <code>for</code>.' }], hint: 'Внутри цикла <code>total = total + i</code>, после цикла <code>print(total)</code>.' },
    ],
    lists: [
      { text: 'Сделай список <code>colors</code> из <code>"красный"</code>, <code>"зелёный"</code>, <code>"синий"</code> и выведи первый элемент.', starter: '', expect: 'красный', must: [{ re: '\\[\\s*0\\s*\\]', hint: 'Первый элемент это <code>[0]</code>.' }], hint: '<code>print(colors[0])</code>' },
      { text: 'Есть <code>nums = [1, 2]</code>. Добавь 3 через <code>append</code> и выведи длину списка.', starter: 'nums = [1, 2]\n', expect: '3', must: [{ re: 'append', hint: 'Добавь через <code>nums.append(3)</code>.' }, { re: 'len\\s*\\(', hint: 'Длину считает <code>len(nums)</code>.' }], hint: '<code>nums.append(3)</code>, потом <code>print(len(nums))</code>.' },
      { text: 'Сделай список <code>nums</code> из 4, 8 и 15 и выведи сумму через <code>sum</code>.', starter: '', expect: '27', must: [{ re: 'sum\\s*\\(', hint: 'Сумму посчитает <code>sum(nums)</code>.' }], hint: '<code>print(sum(nums))</code>' },
    ],
    func: [
      { text: 'Напиши функцию <code>hello()</code>, которая печатает <code>Привет</code>, и вызови её.', starter: 'def hello():\n    \n', expect: 'Привет', must: [{ re: '\\bdef\\s+hello', hint: 'Начни с <code>def hello():</code>.' }, { re: '(^|\\n)hello\\s*\\(\\s*\\)', hint: 'Вызови функцию без отступа: <code>hello()</code>.' }], hint: 'Внутри: <code>print("Привет")</code>. Внизу без отступа: <code>hello()</code>.' },
      { text: 'Функция <code>double(n)</code> возвращает <code>n * 2</code>. Выведи <code>double(21)</code>.', starter: 'def double(n):\n    \n', expect: '42', must: [{ re: '\\breturn\\b', hint: 'Результат отдаёт <code>return</code>.' }], hint: '<code>return n * 2</code>, потом <code>print(double(21))</code>.' },
      { text: 'Функция <code>square(n)</code> возвращает <code>n * n</code>. Выведи <code>square(7)</code>.', starter: 'def square(n):\n    \n', expect: '49', must: [{ re: '\\bdef\\s+square', hint: 'Нужна функция <code>square</code>.' }, { re: '\\breturn\\b', hint: 'Результат отдаёт <code>return</code>.' }], hint: '<code>return n * n</code>' },
    ],
  },

  en: {
    install: [
      { text: 'Print the word <code>Hello</code>.', starter: 'print()\n', expect: 'Hello', hint: 'Text in quotes inside the brackets: <code>print("Hello")</code>.' },
      { text: 'Let Python work out <code>5 * 6</code>.', starter: 'print()\n', expect: '30', must: [{ re: '\\*', hint: 'Python should do the maths: write <code>5 * 6</code> in the brackets.' }], hint: '<code>print(5 * 6)</code>' },
      { text: 'Now <code>7 + 3</code>, again without typing the answer.', starter: 'print()\n', expect: '10', must: [{ re: '\\+', hint: 'Write exactly <code>7 + 3</code> in the brackets.' }], hint: '<code>print(7 + 3)</code>' },
    ],
    print: [
      { text: 'Print one line: <code>I am learning Python</code>.', starter: '', expect: 'I am learning Python', hint: '<code>print("I am learning Python")</code>' },
      { text: 'Two lines: first <code>I am learning Python</code>, then <code>Step 2</code>.', starter: '', expect: 'I am learning Python\nStep 2', hint: 'Two <code>print</code> commands, each on its own line.' },
      { text: 'Print the text <code>Answer:</code> and the result of <code>6 * 7</code>, separated by a comma.', starter: '', expect: 'Answer: 42', must: [{ re: ',', hint: 'Separate the two pieces with a comma inside the brackets.' }, { re: '\\*', hint: 'Let Python work out <code>6 * 7</code>.' }], hint: '<code>print("Answer:", 6 * 7)</code>' },
    ],
    vars: [
      { text: 'Create a variable <code>x</code> with the value <code>7</code> and print it.', starter: '', expect: '7', must: [{ re: '\\bx\\s*=\\s*7', hint: 'Start with <code>x = 7</code>.' }, { re: 'print\\s*\\(\\s*x\\s*\\)', hint: 'Print the variable without quotes: <code>print(x)</code>.' }], hint: '<code>x = 7</code>, then <code>print(x)</code>.' },
      { text: 'You have <code>a = 5</code> and <code>b = 8</code>. Print their sum using the variable names.', starter: 'a = 5\nb = 8\n', expect: '13', must: [{ re: 'print\\s*\\(\\s*(a\\s*\\+\\s*b|b\\s*\\+\\s*a)', hint: 'Add the variables themselves: <code>print(a + b)</code>.' }], hint: '<code>print(a + b)</code>' },
      { text: 'You have <code>score = 10</code>. Increase <code>score</code> by 5 and print it.', starter: 'score = 10\n', expect: '15', must: [{ re: 'score\\s*=\\s*score\\s*\\+\\s*5|score\\s*\\+=\\s*5', hint: 'Put the old value plus 5 back into <code>score</code>.' }], hint: '<code>score = score + 5</code>, then <code>print(score)</code>.' },
    ],
    input: [
      { text: 'Ask for a name with <code>input</code> and print <code>Hi,</code> and the name. The check types "Anna".', starter: 'name = input("What is your name? ")\n', inputs: ['Anna'], includes: 'Hi, Anna', must: [{ re: 'input\\s*\\(', hint: 'Get the name with <code>input</code>.' }], hint: '<code>print("Hi,", name)</code>' },
      { text: 'Ask for a number and print it multiplied by 2. The check types 21.', starter: 'n = int(input("Enter a number: "))\n', inputs: ['21'], includes: '42', must: [{ re: 'input\\s*\\(', hint: 'Get the number with <code>input</code>.' }], hint: '<code>print(n * 2)</code>' },
      { text: 'Ask for two numbers and print their sum. The check types 4 and 5.', starter: '', inputs: ['4', '5'], includes: '9', must: [{ re: 'input[\\s\\S]*input', hint: 'Ask twice with <code>input</code>.' }, { re: 'int\\s*\\(', hint: 'Without <code>int()</code> you get "45", not 9.' }], hint: '<code>a = int(input())</code>, <code>b = int(input())</code>, <code>print(a + b)</code>.' },
    ],
    if: [
      { text: 'You have <code>x = 7</code>. If <code>x</code> is greater than 5, print <code>Bigger</code>.', starter: 'x = 7\n', expect: 'Bigger', must: [{ re: '\\bif\\b', hint: 'Use <code>if</code>, not just print.' }], hint: '<code>if x &gt; 5:</code>, then 4 spaces and print on the next line.' },
      { text: 'You have <code>t = 30</code>. If it is greater than 25 print <code>Hot</code>, otherwise <code>Cool</code>.', starter: 't = 30\n', expect: 'Hot', must: [{ re: '\\bif\\b', hint: 'Use <code>if</code>.' }, { re: '\\belse\\b', hint: 'Add an <code>else</code> branch.' }], hint: '<code>if t &gt; 25:</code> … <code>else:</code> …' },
      { text: 'You have <code>n = 4</code>. Print <code>Even</code> if <code>n % 2 == 0</code>, otherwise <code>Odd</code>.', starter: 'n = 4\n', expect: 'Even', must: [{ re: '%', hint: '<code>%</code> gives the remainder. For even numbers it is 0.' }, { re: '\\belse\\b', hint: 'Add an <code>else</code> branch for "Odd".' }], hint: '<code>if n % 2 == 0:</code>' },
    ],
    for: [
      { text: 'Use <code>for</code> to print the word <code>Hi</code> three times.', starter: '', expect: 'Hi\nHi\nHi', must: [{ re: '\\bfor\\b', hint: 'Use a <code>for</code> loop, not three prints.' }], hint: '<code>for i in range(3):</code> and inside it <code>print("Hi")</code>.' },
      { text: 'Print the numbers 1 to 5, each on its own line.', starter: '', expect: '1\n2\n3\n4\n5', must: [{ re: '\\bfor\\b', hint: 'Use a <code>for</code> loop.' }], hint: '<code>for n in range(1, 6):</code>' },
      { text: 'Use a loop to add up the numbers 1 to 10 and print the total.', starter: 'total = 0\n', expect: '55', must: [{ re: '\\bfor\\b', hint: 'Add the numbers in a <code>for</code> loop.' }], hint: 'Inside the loop <code>total = total + i</code>, after it <code>print(total)</code>.' },
    ],
    lists: [
      { text: 'Make a list <code>colors</code> with <code>"red"</code>, <code>"green"</code>, <code>"blue"</code> and print the first item.', starter: '', expect: 'red', must: [{ re: '\\[\\s*0\\s*\\]', hint: 'The first item is <code>[0]</code>.' }], hint: '<code>print(colors[0])</code>' },
      { text: 'You have <code>nums = [1, 2]</code>. Add 3 with <code>append</code> and print the length.', starter: 'nums = [1, 2]\n', expect: '3', must: [{ re: 'append', hint: 'Add it with <code>nums.append(3)</code>.' }, { re: 'len\\s*\\(', hint: '<code>len(nums)</code> counts the items.' }], hint: '<code>nums.append(3)</code>, then <code>print(len(nums))</code>.' },
      { text: 'Make a list <code>nums</code> with 4, 8 and 15 and print the sum with <code>sum</code>.', starter: '', expect: '27', must: [{ re: 'sum\\s*\\(', hint: '<code>sum(nums)</code> adds them up.' }], hint: '<code>print(sum(nums))</code>' },
    ],
    func: [
      { text: 'Write a function <code>hello()</code> that prints <code>Hello</code>, and call it.', starter: 'def hello():\n    \n', expect: 'Hello', must: [{ re: '\\bdef\\s+hello', hint: 'Start with <code>def hello():</code>.' }, { re: '(^|\\n)hello\\s*\\(\\s*\\)', hint: 'Call it without indentation: <code>hello()</code>.' }], hint: 'Inside: <code>print("Hello")</code>. Below, without indentation: <code>hello()</code>.' },
      { text: 'The function <code>double(n)</code> returns <code>n * 2</code>. Print <code>double(21)</code>.', starter: 'def double(n):\n    \n', expect: '42', must: [{ re: '\\breturn\\b', hint: '<code>return</code> hands back the result.' }], hint: '<code>return n * 2</code>, then <code>print(double(21))</code>.' },
      { text: 'The function <code>square(n)</code> returns <code>n * n</code>. Print <code>square(7)</code>.', starter: 'def square(n):\n    \n', expect: '49', must: [{ re: '\\bdef\\s+square', hint: 'You need a function called <code>square</code>.' }, { re: '\\breturn\\b', hint: '<code>return</code> hands back the result.' }], hint: '<code>return n * n</code>' },
    ],
  },

  de: {
    install: [
      { text: 'Gib das Wort <code>Hallo</code> aus.', starter: 'print()\n', expect: 'Hallo', hint: 'Text in Anführungszeichen in die Klammern: <code>print("Hallo")</code>.' },
      { text: 'Lass Python <code>5 * 6</code> ausrechnen.', starter: 'print()\n', expect: '30', must: [{ re: '\\*', hint: 'Python soll rechnen: schreib <code>5 * 6</code> in die Klammern.' }], hint: '<code>print(5 * 6)</code>' },
      { text: 'Jetzt <code>7 + 3</code>, wieder ohne die Antwort selbst hinzuschreiben.', starter: 'print()\n', expect: '10', must: [{ re: '\\+', hint: 'Schreib genau <code>7 + 3</code> in die Klammern.' }], hint: '<code>print(7 + 3)</code>' },
    ],
    print: [
      { text: 'Gib eine Zeile aus: <code>Ich lerne Python</code>.', starter: '', expect: 'Ich lerne Python', hint: '<code>print("Ich lerne Python")</code>' },
      { text: 'Zwei Zeilen: zuerst <code>Ich lerne Python</code>, darunter <code>Schritt 2</code>.', starter: '', expect: 'Ich lerne Python\nSchritt 2', hint: 'Zwei <code>print</code>-Befehle, jeder in einer eigenen Zeile.' },
      { text: 'Gib mit Komma den Text <code>Antwort:</code> und das Ergebnis von <code>6 * 7</code> aus.', starter: '', expect: 'Antwort: 42', must: [{ re: ',', hint: 'Trenn die beiden Teile mit einem Komma in den Klammern.' }, { re: '\\*', hint: 'Lass Python <code>6 * 7</code> rechnen.' }], hint: '<code>print("Antwort:", 6 * 7)</code>' },
    ],
    vars: [
      { text: 'Leg eine Variable <code>x</code> mit dem Wert <code>7</code> an und gib sie aus.', starter: '', expect: '7', must: [{ re: '\\bx\\s*=\\s*7', hint: 'Fang mit <code>x = 7</code> an.' }, { re: 'print\\s*\\(\\s*x\\s*\\)', hint: 'Gib die Variable ohne Anführungszeichen aus: <code>print(x)</code>.' }], hint: '<code>x = 7</code>, dann <code>print(x)</code>.' },
      { text: 'Es gibt <code>a = 5</code> und <code>b = 8</code>. Gib die Summe über die Variablennamen aus.', starter: 'a = 5\nb = 8\n', expect: '13', must: [{ re: 'print\\s*\\(\\s*(a\\s*\\+\\s*b|b\\s*\\+\\s*a)', hint: 'Addiere die Variablen selbst: <code>print(a + b)</code>.' }], hint: '<code>print(a + b)</code>' },
      { text: 'Es gibt <code>punkte = 10</code>. Erhöhe <code>punkte</code> um 5 und gib sie aus.', starter: 'punkte = 10\n', expect: '15', must: [{ re: 'punkte\\s*=\\s*punkte\\s*\\+\\s*5|punkte\\s*\\+=\\s*5', hint: 'Leg den alten Wert plus 5 zurück in <code>punkte</code>.' }], hint: '<code>punkte = punkte + 5</code>, dann <code>print(punkte)</code>.' },
    ],
    input: [
      { text: 'Frag mit <code>input</code> nach dem Namen und gib <code>Hallo,</code> und den Namen aus. Die Prüfung tippt „Anna“.', starter: 'name = input("Wie heißt du? ")\n', inputs: ['Anna'], includes: 'Hallo, Anna', must: [{ re: 'input\\s*\\(', hint: 'Hol den Namen mit <code>input</code>.' }], hint: '<code>print("Hallo,", name)</code>' },
      { text: 'Frag nach einer Zahl und gib sie mal 2 aus. Die Prüfung tippt 21.', starter: 'n = int(input("Gib eine Zahl ein: "))\n', inputs: ['21'], includes: '42', must: [{ re: 'input\\s*\\(', hint: 'Hol die Zahl mit <code>input</code>.' }], hint: '<code>print(n * 2)</code>' },
      { text: 'Frag nach zwei Zahlen und gib ihre Summe aus. Die Prüfung tippt 4 und 5.', starter: '', inputs: ['4', '5'], includes: '9', must: [{ re: 'input[\\s\\S]*input', hint: 'Frag zweimal mit <code>input</code>.' }, { re: 'int\\s*\\(', hint: 'Ohne <code>int()</code> kommt „45“ heraus, nicht 9.' }], hint: '<code>a = int(input())</code>, <code>b = int(input())</code>, <code>print(a + b)</code>.' },
    ],
    if: [
      { text: 'Es gibt <code>x = 7</code>. Wenn <code>x</code> größer als 5 ist, gib <code>Größer</code> aus.', starter: 'x = 7\n', expect: 'Größer', must: [{ re: '\\bif\\b', hint: 'Benutze <code>if</code>, nicht nur print.' }], hint: '<code>if x &gt; 5:</code>, in der nächsten Zeile 4 Leerzeichen und print.' },
      { text: 'Es gibt <code>t = 30</code>. Wenn größer als 25, gib <code>Heiß</code> aus, sonst <code>Kühl</code>.', starter: 't = 30\n', expect: 'Heiß', must: [{ re: '\\bif\\b', hint: 'Benutze <code>if</code>.' }, { re: '\\belse\\b', hint: 'Füg einen <code>else</code>-Zweig hinzu.' }], hint: '<code>if t &gt; 25:</code> … <code>else:</code> …' },
      { text: 'Es gibt <code>n = 4</code>. Gib <code>Gerade</code> aus, wenn <code>n % 2 == 0</code>, sonst <code>Ungerade</code>.', starter: 'n = 4\n', expect: 'Gerade', must: [{ re: '%', hint: '<code>%</code> liefert den Rest. Bei geraden Zahlen ist er 0.' }, { re: '\\belse\\b', hint: 'Füg einen <code>else</code>-Zweig für „Ungerade“ hinzu.' }], hint: '<code>if n % 2 == 0:</code>' },
    ],
    for: [
      { text: 'Gib mit <code>for</code> dreimal das Wort <code>Hallo</code> aus.', starter: '', expect: 'Hallo\nHallo\nHallo', must: [{ re: '\\bfor\\b', hint: 'Benutze eine <code>for</code>-Schleife, nicht dreimal print.' }], hint: '<code>for i in range(3):</code> und darin <code>print("Hallo")</code>.' },
      { text: 'Gib die Zahlen von 1 bis 5 aus, jede in einer eigenen Zeile.', starter: '', expect: '1\n2\n3\n4\n5', must: [{ re: '\\bfor\\b', hint: 'Benutze eine <code>for</code>-Schleife.' }], hint: '<code>for n in range(1, 6):</code>' },
      { text: 'Rechne mit einer Schleife die Summe der Zahlen von 1 bis 10 aus und gib sie aus.', starter: 'summe = 0\n', expect: '55', must: [{ re: '\\bfor\\b', hint: 'Addiere die Zahlen in einer <code>for</code>-Schleife.' }], hint: 'In der Schleife <code>summe = summe + i</code>, danach <code>print(summe)</code>.' },
    ],
    lists: [
      { text: 'Mach eine Liste <code>farben</code> mit <code>"rot"</code>, <code>"grün"</code>, <code>"blau"</code> und gib das erste Element aus.', starter: '', expect: 'rot', must: [{ re: '\\[\\s*0\\s*\\]', hint: 'Das erste Element ist <code>[0]</code>.' }], hint: '<code>print(farben[0])</code>' },
      { text: 'Es gibt <code>zahlen = [1, 2]</code>. Häng mit <code>append</code> die 3 an und gib die Länge aus.', starter: 'zahlen = [1, 2]\n', expect: '3', must: [{ re: 'append', hint: 'Häng sie mit <code>zahlen.append(3)</code> an.' }, { re: 'len\\s*\\(', hint: '<code>len(zahlen)</code> zählt die Elemente.' }], hint: '<code>zahlen.append(3)</code>, dann <code>print(len(zahlen))</code>.' },
      { text: 'Mach eine Liste <code>zahlen</code> mit 4, 8 und 15 und gib die Summe mit <code>sum</code> aus.', starter: '', expect: '27', must: [{ re: 'sum\\s*\\(', hint: '<code>sum(zahlen)</code> addiert alles.' }], hint: '<code>print(sum(zahlen))</code>' },
    ],
    func: [
      { text: 'Schreib eine Funktion <code>hallo()</code>, die <code>Hallo</code> ausgibt, und ruf sie auf.', starter: 'def hallo():\n    \n', expect: 'Hallo', must: [{ re: '\\bdef\\s+hallo', hint: 'Fang mit <code>def hallo():</code> an.' }, { re: '(^|\\n)hallo\\s*\\(\\s*\\)', hint: 'Ruf sie ohne Einrückung auf: <code>hallo()</code>.' }], hint: 'Darin: <code>print("Hallo")</code>. Darunter ohne Einrückung: <code>hallo()</code>.' },
      { text: 'Die Funktion <code>doppelt(n)</code> gibt <code>n * 2</code> zurück. Gib <code>doppelt(21)</code> aus.', starter: 'def doppelt(n):\n    \n', expect: '42', must: [{ re: '\\breturn\\b', hint: '<code>return</code> gibt das Ergebnis zurück.' }], hint: '<code>return n * 2</code>, dann <code>print(doppelt(21))</code>.' },
      { text: 'Die Funktion <code>quadrat(n)</code> gibt <code>n * n</code> zurück. Gib <code>quadrat(7)</code> aus.', starter: 'def quadrat(n):\n    \n', expect: '49', must: [{ re: '\\bdef\\s+quadrat', hint: 'Du brauchst eine Funktion namens <code>quadrat</code>.' }, { re: '\\breturn\\b', hint: '<code>return</code> gibt das Ergebnis zurück.' }], hint: '<code>return n * n</code>' },
    ],
  },
};
