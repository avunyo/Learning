/*
  Lesson content (Russian). Same structure in lessons.en.js and lessons.de.js.
  Lesson ids must match across languages: progress is stored by id.

  code:   what the illustrated editor shows. [[id|text]] marks a piece that a callout points to.
  output: what the program prints (shown in the terminal / Shell).
  annos:  callouts. side: "l" or "r". kind picks the colour (kw, str, bi, def, com, num, ui, out).
          mode: "idle" or "vscode" shows the callout only in that editor view.
          id "out" points at the output; other ids point at [[id|...]] in the code
          or at parts of the editor window (tab, gutter, run, term, title, menu-run, shell, prompt).
  learn:  explanation sections { h, html }.
  task:   { text, starter, expect | includes, inputs, must: [{ re, hint }], hint }.
*/

window.CONTENT = window.CONTENT || {};
window.CONTENT.ru = {};

window.CONTENT.ru.start = {
  kicker: 'С чего начать',
  title: 'Вот так выглядит место, где пишут код',
  file: 'hello.py',
  code: [
    '[[comment|# моя первая программа]]',
    '[[code|print]]("Привет, мир!")',
  ].join('\n'),
  output: 'Привет, мир!',
  annos: [
    { id: 'tab', side: 'l', kind: 'ui', mode: 'vscode', title: 'Файл с кодом', text: 'Программа живёт в обычном файле. У файлов на Python окончание <code>.py</code>.' },
    { id: 'gutter', side: 'l', kind: 'ui', mode: 'vscode', title: 'Номера строк', text: 'Если что-то сломается, Python скажет номер строки с ошибкой.' },
    { id: 'title', side: 'l', kind: 'ui', mode: 'idle', title: 'Окно файла', text: 'В IDLE: File → New File. Пишешь код и сохраняешь как <code>hello.py</code>.' },
    { id: 'comment', side: 'l', kind: 'com', title: 'Комментарий', text: 'Всё после <code>#</code> Python пропускает. Это заметки для людей.' },
    { id: 'run', side: 'r', kind: 'str', mode: 'vscode', title: 'Запуск', text: 'Треугольник запускает файл. Python читает код сверху вниз.' },
    { id: 'menu-run', side: 'r', kind: 'str', mode: 'idle', title: 'Меню Run', text: 'Run → Run Module или клавиша F5 запускает файл.' },
    { id: 'code', side: 'r', kind: 'bi', title: 'Команда', text: '<code>print</code> показывает на экране то, что в скобках.' },
    { id: 'term', side: 'r', kind: 'out', mode: 'vscode', title: 'Терминал', text: 'Сюда программа пишет результат.' },
    { id: 'shell', side: 'r', kind: 'out', mode: 'idle', title: 'Окно Shell', text: 'Здесь виден результат. После <code>&gt;&gt;&gt;</code> можно вводить команды по одной.' },
  ],
  try: '# Нажми «Запустить» и посмотри вниз\nprint("Привет, мир!")\nprint("2 + 2 =", 2 + 2)\n',
  intro: `
    <h3>Что такое Python</h3>
    <p class="lead">Язык, на котором объясняют компьютеру, что делать. Его выбирают первым, потому что код на нём читается почти как обычный английский.</p>
    <p>На Python пишут игры и ботов, анализируют данные, учат нейросети и автоматизируют скучную работу.</p>
    <h3>Как тут учиться</h3>
    <ol>
      <li>Смотри на схему: подписи объясняют каждую часть кода.</li>
      <li>Читай короткое объяснение справа.</li>
      <li>Меняй код в окне «Попробуй сам» и запускай.</li>
      <li>Решай задание, и урок отметится галочкой.</li>
    </ol>`,
  choiceZero: { title: 'Я с полного нуля', text: 'Начнём с установки Python' },
  choiceKnow: { title: 'Python уже стоит', text: 'Сразу к первой программе' },
};

window.CONTENT.ru.lessons = [
  {
    id: 'install',
    short: 'Ставим Python',
    title: 'Ставим Python и открываем IDLE',
    icon: 'download',
    tone: 'def',
    mode: 'idle',
    file: 'proba.py',
    code: [
      '[[p|print]]("Python работает!")',
      'print([[math|2 + 2]])',
    ].join('\n'),
    output: 'Python работает!\n4',
    annos: [
      { id: 'title', side: 'l', kind: 'ui', mode: 'idle', title: 'Версия Python', text: 'В заголовке видно версию. Нам подойдёт любая, начиная с 3.10.' },
      { id: 'tab', side: 'l', kind: 'ui', mode: 'vscode', title: 'Файл proba.py', text: 'В VS Code: File → New File, потом сохранить с окончанием <code>.py</code>.' },
      { id: 'p', side: 'l', kind: 'bi', title: 'Первая команда', text: '<code>print</code> печатает текст в кавычках.' },
      { id: 'math', side: 'r', kind: 'num', title: 'Python умеет считать', text: 'Без кавычек <code>2 + 2</code> — это пример, а не текст.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Результат', text: 'Две команды, две строчки ответа.' },
    ],
    learn: [
      { h: 'Скачай Python', html: '<p>Открой <a href="https://www.python.org/downloads/" target="_blank" rel="noopener">python.org/downloads</a> и нажми большую жёлтую кнопку Download Python.</p>' },
      { h: 'Одна важная галочка', html: '<p>В первом окне установщика на Windows отметь <code>Add python.exe to PATH</code>, а потом нажми Install Now. Без этой галочки Python потом не найдётся из терминала.</p>' },
      { h: 'Открой IDLE', html: '<p>IDLE ставится вместе с Python. Нажми «Пуск», набери IDLE и открой. Появится окно Shell с <code>&gt;&gt;&gt;</code>: напиши <code>2 + 2</code> и нажми Enter.</p><p>Чтобы писать программу из нескольких строк: File → New File, сохрани файл и нажми F5.</p>' },
      { h: 'А VS Code?', html: '<p>Это редактор для больших проектов. Он бесплатный: скачай с <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">code.visualstudio.com</a> и поставь расширение Python. Начинать спокойно можно с IDLE. Переключатель над схемой показывает оба редактора.</p>' },
      { h: 'Ничего не хочется ставить?', html: '<p class="note">Окно «Попробуй сам» ниже запускает настоящий Python прямо в браузере. Все уроки можно пройти только в нём.</p>' },
    ],
    example: 'print("Python работает!")\nprint(2 + 2)\n',
    task: {
      text: 'Пусть Python сам посчитает <code>7 + 3</code> и покажет ответ.',
      starter: 'print()\n',
      expect: '10',
      must: [{ re: '\\+', hint: 'Ответ должен посчитать Python: напиши в скобках именно 7 + 3.' }],
      hint: 'Внутри скобок без кавычек: <code>print(7 + 3)</code>.',
    },
  },
  {
    id: 'print',
    short: 'Первая программа',
    title: 'print: программа что-то говорит',
    icon: 'screen',
    tone: 'bi',
    file: 'privet.py',
    code: [
      '[[p|print]]([[s|"Привет!"]])',
      'print("Меня зовут", [[comma|"Аня"]])',
      'print([[math|3 * 4]])',
    ].join('\n'),
    output: 'Привет!\nМеня зовут Аня\n12',
    annos: [
      { id: 'p', side: 'l', kind: 'bi', title: 'print', text: 'Встроенная команда. Всё, что в скобках, появится на экране.' },
      { id: 's', side: 'l', kind: 'str', title: 'Строка', text: 'Текст в кавычках. Python выводит его как есть, буква в букву.' },
      { id: 'comma', side: 'r', kind: 'str', title: 'Через запятую', text: 'Можно передать несколько кусков. Между ними print сам поставит пробел.' },
      { id: 'math', side: 'r', kind: 'num', title: 'Вычисление', text: '<code>*</code> умножает, <code>/</code> делит. Получится 12, а не «3 * 4».' },
      { id: 'out', side: 'r', kind: 'out', title: 'Каждый print — новая строка', text: 'Три команды, три строчки.' },
    ],
    learn: [
      { h: 'Что делает print', html: '<p class="lead">Программа — это список команд. Первая команда, которую учат все: <code>print(...)</code>. Она показывает на экране то, что ей дали в скобках.</p>' },
      { h: 'Текст и числа', html: '<p>Текст всегда пишут в кавычках: <code>"Привет"</code>. Это называется строка. Числа пишут без кавычек, и с ними можно считать: <code>+ - * /</code>.</p><p>Сравни: <code>print("2 + 2")</code> напечатает «2 + 2», а <code>print(2 + 2)</code> напечатает 4.</p>' },
      { h: 'Частые ошибки', html: '<ul><li>Забыта кавычка: <code>print("Привет)</code></li><li>Забыта скобка: <code>print("Привет"</code></li><li>Большая буква: <code>Print</code>. Python различает регистр, нужно <code>print</code>.</li></ul>' },
    ],
    task: {
      text: 'Выведи две строки: сначала <code>Я учу Python</code>, а под ней <code>Шаг 2</code>.',
      starter: '# две команды print\n',
      expect: 'Я учу Python\nШаг 2',
      hint: 'Две отдельные строчки кода, каждая начинается с <code>print(</code>.',
    },
  },
  {
    id: 'vars',
    short: 'Переменные',
    title: 'Переменные: запоминаем значения',
    icon: 'box',
    tone: 'str',
    file: 'vozrast.py',
    code: [
      '[[name|name]] [[eq|=]] [[val|"Аня"]]',
      'age = 15',
      'age = [[upd|age + 1]]',
      '[[use|print(name, "через год будет", age)]]',
    ].join('\n'),
    output: 'Аня через год будет 16',
    annos: [
      { id: 'name', side: 'l', kind: 'def', title: 'Имя переменной', text: 'Придумываешь сам: латиницей, без пробелов. Лучше понятное: <code>age</code>, а не <code>x</code>.' },
      { id: 'eq', side: 'l', kind: 'kw', title: 'Знак =', text: 'Это не «равно», а «положи в». Справа значение, слева куда его положить.' },
      { id: 'val', side: 'l', kind: 'str', title: 'Значение', text: 'Переменная может хранить текст, число и многое другое.' },
      { id: 'upd', side: 'r', kind: 'num', title: 'Новое значение', text: 'Берём то, что лежало в <code>age</code>, прибавляем 1 и кладём обратно.' },
      { id: 'use', side: 'r', kind: 'bi', title: 'Используем', text: 'Пишем имя без кавычек, и Python подставит то, что внутри.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Результат', text: 'Было 15, стало 16.' },
    ],
    learn: [
      { h: 'Коробка с наклейкой', html: '<p class="lead">Переменная — это коробка с именем. Кладёшь в неё значение один раз и потом берёшь по имени сколько угодно.</p><p><code>score = 0</code> означает «создай коробку score и положи туда 0».</p>' },
      { h: 'Имя в кавычках и без', html: '<p><code>print(name)</code> покажет то, что лежит в переменной. <code>print("name")</code> покажет само слово name. Кавычки решают всё.</p>' },
      { h: 'Значение можно менять', html: '<p>Код читается сверху вниз. Если ниже написать <code>age = 20</code>, старое значение заменится новым.</p>' },
    ],
    task: {
      text: 'Создай переменные <code>a = 5</code> и <code>b = 8</code>, а потом выведи их сумму через имена переменных.',
      starter: 'a = 5\nb = 8\n',
      expect: '13',
      must: [{ re: 'print\\s*\\(\\s*a\\s*\\+\\s*b|print\\s*\\(\\s*b\\s*\\+\\s*a', hint: 'Нужно сложить именно переменные: <code>print(a + b)</code>.' }],
      hint: '<code>print(a + b)</code>',
    },
  },
  {
    id: 'input',
    short: 'Ввод с клавиатуры',
    title: 'input: программа задаёт вопрос',
    icon: 'keyboard',
    tone: 'bi',
    file: 'vopros.py',
    code: [
      'name = [[inp|input]]([[q|"Как тебя зовут? "]])',
      'print("Привет,", name)',
      'year = [[int|int]](input("Год рождения? "))',
      'print("В 2030 тебе будет", [[calc|2030 - year]])',
    ].join('\n'),
    output: 'Как тебя зовут? Аня\nПривет, Аня\nГод рождения? 2011\nВ 2030 тебе будет 19',
    annos: [
      { id: 'inp', side: 'l', kind: 'bi', title: 'input', text: 'Программа останавливается и ждёт, пока человек напишет ответ и нажмёт Enter.' },
      { id: 'q', side: 'l', kind: 'str', title: 'Вопрос', text: 'Текст в скобках видно перед полем ввода. Пробел в конце, чтобы ответ не слипся.' },
      { id: 'int', side: 'l', kind: 'bi', title: 'int', text: 'input всегда даёт текст. <code>int(...)</code> превращает его в число, с которым можно считать.' },
      { id: 'calc', side: 'r', kind: 'num', title: 'Считаем', text: 'Теперь <code>year</code> — число, и вычитание работает.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Разговор', text: 'Вопросы программы и ответы человека идут по очереди.' },
    ],
    learn: [
      { h: 'Программа слушает', html: '<p class="lead"><code>input()</code> ставит программу на паузу и ждёт ответа с клавиатуры. Что человек напишет, то и вернётся.</p><p>В этом окне браузер покажет маленькое окошко для ответа.</p>' },
      { h: 'Текст или число', html: '<p>Ответ из input всегда строка, даже если ввели цифры. <code>"5" + "5"</code> даёт <code>"55"</code>, а не 10. Поэтому для чисел пишут <code>int(input())</code>.</p>' },
    ],
    task: {
      text: 'Спроси у человека число и выведи его, умноженное на 2. Проверка подставит число 21.',
      starter: 'n = int(input("Введи число: "))\n',
      inputs: ['21'],
      includes: '42',
      must: [{ re: 'input\\s*\\(', hint: 'Число нужно получить через <code>input</code>.' }],
      hint: '<code>print(n * 2)</code>',
    },
  },
  {
    id: 'if',
    short: 'Условия',
    title: 'if: программа выбирает',
    icon: 'fork',
    tone: 'kw',
    file: 'golos.py',
    code: [
      'age = 15',
      '[[if|if]] age [[cmp|>=]] 18[[colon|:]]',
      '[[ind|    ]]print("Можно голосовать")',
      '[[else|else]]:',
      '    print("Пока рано")',
    ].join('\n'),
    output: 'Пока рано',
    annos: [
      { id: 'if', side: 'l', kind: 'kw', title: 'if', text: 'По-английски «если». Дальше идёт вопрос, на который ответ «да» или «нет».' },
      { id: 'cmp', side: 'l', kind: 'num', title: 'Сравнение', text: '<code>&gt;=</code> больше или равно. Есть ещё <code>&lt;</code>, <code>&gt;</code>, <code>==</code> (равно), <code>!=</code> (не равно).' },
      { id: 'ind', side: 'l', kind: 'ui', title: 'Отступ', text: 'Четыре пробела. Так Python понимает, какие строки относятся к if.' },
      { id: 'colon', side: 'r', kind: 'kw', title: 'Двоеточие', text: 'Открывает блок. Без него будет SyntaxError.' },
      { id: 'else', side: 'r', kind: 'kw', title: 'else', text: '«Иначе». Выполнится, если условие не подошло.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Сработала одна ветка', text: '15 меньше 18, поэтому выполнился блок после else.' },
    ],
    learn: [
      { h: 'Развилка', html: '<p class="lead">Иногда программа должна сделать одно или другое. <code>if</code> проверяет условие и выполняет блок, только если ответ «да».</p>' },
      { h: 'Два знака равно', html: '<p><code>=</code> кладёт значение в переменную. <code>==</code> сравнивает: <code>if answer == "да":</code>. Их путают все, это нормально.</p>' },
      { h: 'Больше двух вариантов', html: '<p>Между if и else можно вставить сколько угодно <code>elif</code> («иначе если»). Python проверяет их сверху вниз и выполняет первый подходящий.</p>' },
    ],
    task: {
      text: 'Есть <code>t = 30</code>. Если <code>t</code> больше 25, выведи <code>Жарко</code>, иначе <code>Прохладно</code>.',
      starter: 't = 30\n',
      expect: 'Жарко',
      must: [{ re: '\\bif\\b', hint: 'Решение должно использовать <code>if</code>, а не просто print.' }, { re: '\\belse\\b', hint: 'Добавь ветку <code>else</code> для «Прохладно».' }],
      hint: '<code>if t &gt; 25:</code>, на следующей строке 4 пробела и print.',
    },
  },
  {
    id: 'for',
    short: 'Циклы',
    title: 'for: повторяем без копипаста',
    icon: 'loop',
    tone: 'kw',
    file: 'shagi.py',
    code: [
      '[[for|for]] [[i|i]] in [[range|range(1, 4)]]:',
      '[[body|    print("Шаг", i)]]',
      '[[after|print("Готово!")]]',
    ].join('\n'),
    output: 'Шаг 1\nШаг 2\nШаг 3\nГотово!',
    annos: [
      { id: 'for', side: 'l', kind: 'kw', title: 'for', text: '«Для каждого». Повторяет блок по одному разу на каждое значение.' },
      { id: 'i', side: 'l', kind: 'def', title: 'Счётчик', text: 'На каждом круге в <code>i</code> лежит новое значение: 1, потом 2, потом 3.' },
      { id: 'range', side: 'l', kind: 'bi', title: 'range', text: 'Числа от 1 до 4, но 4 не входит. Так устроен range.' },
      { id: 'body', side: 'r', kind: 'ui', title: 'Тело цикла', text: 'Строки с отступом повторяются.' },
      { id: 'after', side: 'r', kind: 'bi', title: 'После цикла', text: 'Без отступа: выполнится один раз, когда круги закончатся.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Три круга и финал', text: '' },
    ],
    learn: [
      { h: 'Зачем циклы', html: '<p class="lead">Написать print сто раз скучно. Цикл повторяет блок кода сам, столько раз, сколько нужно.</p>' },
      { h: 'range', html: '<p><code>range(5)</code> даёт 0, 1, 2, 3, 4. <code>range(1, 6)</code> даёт 1…5. Последнее число не входит никогда.</p>' },
      { h: 'Есть ещё while', html: '<p><code>while</code> повторяет, пока условие верно: <code>while lives &gt; 0:</code>. Удобно, когда заранее неизвестно, сколько будет кругов.</p>' },
    ],
    task: {
      text: 'С помощью <code>for</code> выведи числа от 1 до 5, каждое на новой строке.',
      starter: '',
      expect: '1\n2\n3\n4\n5',
      must: [{ re: '\\bfor\\b', hint: 'Нужен цикл <code>for</code>, а не пять print.' }],
      hint: '<code>for n in range(1, 6):</code> и внутри <code>print(n)</code>.',
    },
  },
  {
    id: 'lists',
    short: 'Списки',
    title: 'Списки: много значений в одном',
    icon: 'list',
    tone: 'str',
    file: 'frukty.py',
    code: [
      'fruits = [[br|["яблоко", "банан", "киви"]]]',
      'fruits.[[app|append]]("манго")',
      'print(fruits[[idx|[0]]])',
      'print([[len|len]](fruits))',
    ].join('\n'),
    output: 'яблоко\n4',
    annos: [
      { id: 'br', side: 'l', kind: 'str', title: 'Список', text: 'Квадратные скобки, элементы через запятую. Порядок сохраняется.' },
      { id: 'app', side: 'l', kind: 'def', title: 'append', text: 'Добавляет элемент в конец списка. Теперь в нём 4 фрукта.' },
      { id: 'idx', side: 'r', kind: 'num', title: 'Номер', text: 'Счёт начинается с нуля: <code>[0]</code> первый, <code>[1]</code> второй.' },
      { id: 'len', side: 'r', kind: 'bi', title: 'len', text: 'Длина: сколько элементов в списке.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Результат', text: '' },
    ],
    learn: [
      { h: 'Зачем список', html: '<p class="lead">Когда значений много — оценки, имена, покупки — не нужно заводить по переменной на каждое. Их кладут в один список.</p>' },
      { h: 'Список + цикл', html: '<p>Главная пара в Python:</p><p><code>for f in fruits:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print(f)</code></p><p>Цикл пройдёт по каждому элементу по очереди.</p>' },
    ],
    task: {
      text: 'Сделай список <code>nums</code> из чисел 4, 8 и 15 и выведи их сумму функцией <code>sum</code>.',
      starter: '',
      expect: '27',
      must: [{ re: '\\[', hint: 'Сначала создай список в квадратных скобках.' }, { re: 'sum\\s*\\(', hint: 'Сумму посчитает <code>sum(nums)</code>.' }],
      hint: '<code>nums = [4, 8, 15]</code>, потом <code>print(sum(nums))</code>.',
    },
  },
  {
    id: 'func',
    short: 'Функции',
    title: 'Функции: своя команда',
    icon: 'func',
    tone: 'def',
    file: 'privetstvie.py',
    code: [
      '[[def|def]] [[fname|greet]]([[param|name]]):',
      '    [[ret|return]] "Привет, " + name + "!"',
      '',
      'print([[call|greet("Аня")]])',
      'print(greet("Макс"))',
    ].join('\n'),
    output: 'Привет, Аня!\nПривет, Макс!',
    annos: [
      { id: 'def', side: 'l', kind: 'kw', title: 'def', text: 'Сокращение от define, «определить». Так создают свою команду.' },
      { id: 'fname', side: 'l', kind: 'def', title: 'Имя функции', text: 'По нему функцию потом вызывают, как print.' },
      { id: 'param', side: 'l', kind: 'def', title: 'Параметр', text: 'То, что передают внутрь. При каждом вызове значение своё.' },
      { id: 'ret', side: 'r', kind: 'kw', title: 'return', text: 'Отдаёт результат туда, откуда функцию вызвали.' },
      { id: 'call', side: 'r', kind: 'bi', title: 'Вызов', text: 'Тот же код, другие данные. Написали один раз, используем сколько угодно.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Результат', text: '' },
    ],
    learn: [
      { h: 'Своя команда', html: '<p class="lead">Функция — кусок кода с именем. Пишешь его один раз и вызываешь сколько угодно, каждый раз с новыми данными.</p>' },
      { h: 'print или return', html: '<p><code>print</code> показывает человеку. <code>return</code> отдаёт значение программе, чтобы с ним можно было работать дальше: сложить, сохранить, сравнить.</p>' },
    ],
    task: {
      text: 'Напиши функцию <code>square(n)</code>, которая возвращает <code>n * n</code>, и выведи <code>square(7)</code>.',
      starter: 'def square(n):\n    \n',
      expect: '49',
      must: [{ re: '\\bdef\\s+square', hint: 'Нужна функция с именем <code>square</code>.' }, { re: '\\breturn\\b', hint: 'Функция должна вернуть результат через <code>return</code>.' }],
      hint: 'Внутри функции: <code>return n * n</code>. Потом без отступа: <code>print(square(7))</code>.',
    },
  },
];

window.CONTENT.ru.soon = [
  { title: 'Словари', short: 'Значения по названию, а не по номеру' },
  { title: 'Работа с файлами', short: 'Читаем и записываем .txt' },
  { title: 'Мини-проект: угадай число', short: 'Всё вместе в одной игре' },
  { title: 'GitHub', short: 'Сохраняем свой код в интернете' },
];
