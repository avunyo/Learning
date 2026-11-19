/* Lesson content (English). Same structure as lessons.ru.js, same lesson ids. */
window.CONTENT = window.CONTENT || {};
window.CONTENT.en = {};

window.CONTENT.en.start = {
  kicker: 'Where to begin',
  title: 'This is where code gets written',
  file: 'hello.py',
  code: [
    '[[comment|# my first program]]',
    '[[code|print]]("Hello, world!")',
  ].join('\n'),
  output: 'Hello, world!',
  annos: [
    { id: 'tab', side: 'l', kind: 'ui', mode: 'vscode', title: 'Code file', text: 'A program lives in an ordinary file. Python files end in <code>.py</code>.' },
    { id: 'gutter', side: 'l', kind: 'ui', mode: 'vscode', title: 'Line numbers', text: 'If something breaks, Python tells you the number of the line with the error.' },
    { id: 'title', side: 'l', kind: 'ui', mode: 'idle', title: 'File window', text: 'In IDLE: File → New File. Write your code and save it as <code>hello.py</code>.' },
    { id: 'comment', side: 'l', kind: 'com', title: 'Comment', text: 'Python skips everything after <code>#</code>. These are notes for people.' },
    { id: 'run', side: 'r', kind: 'str', mode: 'vscode', title: 'Run', text: 'The triangle runs the file. Python reads the code from top to bottom.' },
    { id: 'menu-run', side: 'r', kind: 'str', mode: 'idle', title: 'Run menu', text: 'Run → Run Module or the F5 key runs the file.' },
    { id: 'code', side: 'r', kind: 'bi', title: 'Command', text: '<code>print</code> shows on screen whatever is inside the brackets.' },
    { id: 'term', side: 'r', kind: 'out', mode: 'vscode', title: 'Terminal', text: 'This is where the program writes its result.' },
    { id: 'shell', side: 'r', kind: 'out', mode: 'idle', title: 'Shell window', text: 'Here you see the result. After <code>&gt;&gt;&gt;</code> you can type commands one at a time.' },
  ],
  try: '# Press "Run" and look below\nprint("Hello, world!")\nprint("2 + 2 =", 2 + 2)\n',
  intro: `
    <h3>What is Python</h3>
    <p class="lead">A language for telling a computer what to do. People pick it as their first language because Python code reads almost like plain English.</p>
    <p>Python is used for games and bots, data analysis, training neural networks and automating boring work.</p>
    <h3>How to learn here</h3>
    <ol>
      <li>Look at the diagram: the labels explain every part of the code.</li>
      <li>Read the short explanation on the right.</li>
      <li>Change the code in "Try it yourself" and run it.</li>
      <li>Solve the task, and the lesson gets a check mark.</li>
    </ol>`,
  choiceZero: { title: 'I am starting from zero', text: 'We begin by installing Python' },
  choiceKnow: { title: 'Python is already installed', text: 'Straight to the first program' },
};

window.CONTENT.en.lessons = [
  {
    id: 'install',
    short: 'Install Python',
    title: 'Installing Python and opening IDLE',
    icon: 'download',
    tone: 'def',
    mode: 'idle',
    file: 'test.py',
    code: [
      '[[p|print]]("Python works!")',
      'print([[math|2 + 2]])',
    ].join('\n'),
    output: 'Python works!\n4',
    annos: [
      { id: 'title', side: 'l', kind: 'ui', mode: 'idle', title: 'Python version', text: 'The title shows the version. Anything from 3.10 up is fine.' },
      { id: 'tab', side: 'l', kind: 'ui', mode: 'vscode', title: 'The file test.py', text: 'In VS Code: File → New File, then save it with the ending <code>.py</code>.' },
      { id: 'p', side: 'l', kind: 'bi', title: 'First command', text: '<code>print</code> prints the text in quotes.' },
      { id: 'math', side: 'r', kind: 'num', title: 'Python can count', text: 'Without quotes, <code>2 + 2</code> is a sum, not text.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Result', text: 'Two commands, two lines of output.' },
    ],
    learn: [
      { h: 'Download Python', html: '<p>Open <a href="https://www.python.org/downloads/" target="_blank" rel="noopener">python.org/downloads</a> and press the big yellow Download Python button.</p>' },
      { h: 'One important checkbox', html: '<p>On Windows, tick <code>Add python.exe to PATH</code> in the first window of the installer, then press Install Now. Without it, the terminal will not find Python later.</p>' },
      { h: 'Open IDLE', html: '<p>IDLE comes with Python. Press Start, type IDLE and open it. A Shell window with <code>&gt;&gt;&gt;</code> appears: type <code>2 + 2</code> and press Enter.</p><p>To write a program with several lines: File → New File, save the file and press F5.</p>' },
      { h: 'What about VS Code?', html: '<p>It is an editor for bigger projects. It is free: download it from <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">code.visualstudio.com</a> and add the Python extension. IDLE is perfectly fine for starting. The switch above the diagram shows both editors.</p>' },
      { h: 'Rather not install anything?', html: '<p class="note">The "Try it yourself" box below runs real Python right in the browser. You can do every lesson in it alone.</p>' },
    ],
    example: 'print("Python works!")\nprint(2 + 2)\n',
    task: {
      text: 'Let Python work out <code>7 + 3</code> and show the answer.',
      starter: 'print()\n',
      expect: '10',
      must: [{ re: '\\+', hint: 'Python has to do the sum: write exactly 7 + 3 inside the brackets.' }],
      hint: 'Inside the brackets, without quotes: <code>print(7 + 3)</code>.',
    },
  },
  {
    id: 'print',
    short: 'First program',
    title: 'print: the program speaks',
    icon: 'screen',
    tone: 'bi',
    file: 'hello.py',
    code: [
      '[[p|print]]([[s|"Hi!"]])',
      'print("My name is", [[comma|"Anna"]])',
      'print([[math|3 * 4]])',
    ].join('\n'),
    output: 'Hi!\nMy name is Anna\n12',
    annos: [
      { id: 'p', side: 'l', kind: 'bi', title: 'print', text: 'A built-in command. Whatever is inside the brackets appears on screen.' },
      { id: 's', side: 'l', kind: 'str', title: 'String', text: 'Text in quotes. Python prints it exactly as written.' },
      { id: 'comma', side: 'r', kind: 'str', title: 'Separated by commas', text: 'You can pass several pieces. print puts a space between them.' },
      { id: 'math', side: 'r', kind: 'num', title: 'Calculation', text: '<code>*</code> multiplies, <code>/</code> divides. You get 12, not "3 * 4".' },
      { id: 'out', side: 'r', kind: 'out', title: 'Each print is a new line', text: 'Three commands, three lines.' },
    ],
    learn: [
      { h: 'What print does', html: '<p class="lead">A program is a list of commands. The first one everybody learns is <code>print(...)</code>. It shows on screen whatever you give it in the brackets.</p>' },
      { h: 'Text and numbers', html: '<p>Text always goes in quotes: <code>"Hi"</code>. This is called a string. Numbers go without quotes, and you can calculate with them: <code>+ - * /</code>.</p><p>Compare: <code>print("2 + 2")</code> prints "2 + 2", while <code>print(2 + 2)</code> prints 4.</p>' },
      { h: 'Common mistakes', html: '<ul><li>Missing quote: <code>print("Hi)</code></li><li>Missing bracket: <code>print("Hi"</code></li><li>Capital letter: <code>Print</code>. Python is case-sensitive, it must be <code>print</code>.</li></ul>' },
    ],
    task: {
      text: 'Print two lines: first <code>I am learning Python</code>, and below it <code>Step 2</code>.',
      starter: '# two print commands\n',
      expect: 'I am learning Python\nStep 2',
      hint: 'Two separate lines of code, each starting with <code>print(</code>.',
    },
  },
  {
    id: 'vars',
    short: 'Variables',
    title: 'Variables: remembering values',
    icon: 'box',
    tone: 'str',
    file: 'age.py',
    code: [
      '[[name|name]] [[eq|=]] [[val|"Anna"]]',
      'age = 15',
      'age = [[upd|age + 1]]',
      '[[use|print(name, "will be", age, "next year")]]',
    ].join('\n'),
    output: 'Anna will be 16 next year',
    annos: [
      { id: 'name', side: 'l', kind: 'def', title: 'Variable name', text: 'You choose it: Latin letters, no spaces. Clear names are better: <code>age</code>, not <code>x</code>.' },
      { id: 'eq', side: 'l', kind: 'kw', title: 'The = sign', text: 'It does not mean "equals" but "put into". The value on the right goes into the name on the left.' },
      { id: 'val', side: 'l', kind: 'str', title: 'Value', text: 'A variable can hold text, a number and much more.' },
      { id: 'upd', side: 'r', kind: 'num', title: 'New value', text: 'Take what was in <code>age</code>, add 1 and put it back.' },
      { id: 'use', side: 'r', kind: 'bi', title: 'Using it', text: 'Write the name without quotes, and Python puts in what is inside.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Result', text: 'It was 15, now it is 16.' },
    ],
    learn: [
      { h: 'A box with a label', html: '<p class="lead">A variable is a box with a name. You put a value in once and then take it out by name as often as you like.</p><p><code>score = 0</code> means "make a box called score and put 0 in it".</p>' },
      { h: 'Name with and without quotes', html: '<p><code>print(name)</code> shows what is stored in the variable. <code>print("name")</code> shows the word name itself. The quotes make all the difference.</p>' },
      { h: 'Values can change', html: '<p>Code runs from top to bottom. If you write <code>age = 20</code> further down, the new value replaces the old one.</p>' },
    ],
    task: {
      text: 'Create the variables <code>a = 5</code> and <code>b = 8</code>, then print their sum using the variable names.',
      starter: 'a = 5\nb = 8\n',
      expect: '13',
      must: [{ re: 'print\\s*\\(\\s*a\\s*\\+\\s*b|print\\s*\\(\\s*b\\s*\\+\\s*a', hint: 'Add the variables themselves: <code>print(a + b)</code>.' }],
      hint: '<code>print(a + b)</code>',
    },
  },
  {
    id: 'input',
    short: 'Keyboard input',
    title: 'input: the program asks a question',
    icon: 'keyboard',
    tone: 'bi',
    file: 'question.py',
    code: [
      'name = [[inp|input]]([[q|"What is your name? "]])',
      'print("Hi,", name)',
      'year = [[int|int]](input("Year of birth? "))',
      'print("In 2030 you will be", [[calc|2030 - year]])',
    ].join('\n'),
    output: 'What is your name? Anna\nHi, Anna\nYear of birth? 2011\nIn 2030 you will be 19',
    annos: [
      { id: 'inp', side: 'l', kind: 'bi', title: 'input', text: 'The program stops and waits until the person types an answer and presses Enter.' },
      { id: 'q', side: 'l', kind: 'str', title: 'Question', text: 'The text in the brackets is shown before the answer. A space at the end keeps them apart.' },
      { id: 'int', side: 'l', kind: 'bi', title: 'int', text: 'input always gives text. <code>int(...)</code> turns it into a number you can calculate with.' },
      { id: 'calc', side: 'r', kind: 'num', title: 'Calculating', text: 'Now <code>year</code> is a number, so subtraction works.' },
      { id: 'out', side: 'r', kind: 'out', title: 'A conversation', text: 'The program\'s questions and the person\'s answers take turns.' },
    ],
    learn: [
      { h: 'The program listens', html: '<p class="lead"><code>input()</code> pauses the program and waits for an answer from the keyboard. Whatever the person types is what comes back.</p><p>In this box, the browser shows a small window for the answer.</p>' },
      { h: 'Text or number', html: '<p>The answer from input is always a string, even if digits were typed. <code>"5" + "5"</code> gives <code>"55"</code>, not 10. That is why numbers are read with <code>int(input())</code>.</p>' },
    ],
    task: {
      text: 'Ask the person for a number and print it multiplied by 2. The check will type in 21.',
      starter: 'n = int(input("Enter a number: "))\n',
      inputs: ['21'],
      includes: '42',
      must: [{ re: 'input\\s*\\(', hint: 'Get the number with <code>input</code>.' }],
      hint: '<code>print(n * 2)</code>',
    },
  },
  {
    id: 'if',
    short: 'Conditions',
    title: 'if: the program makes a choice',
    icon: 'fork',
    tone: 'kw',
    file: 'vote.py',
    code: [
      'age = 15',
      '[[if|if]] age [[cmp|>=]] 18[[colon|:]]',
      '[[ind|    ]]print("You can vote")',
      '[[else|else]]:',
      '    print("Not yet")',
    ].join('\n'),
    output: 'Not yet',
    annos: [
      { id: 'if', side: 'l', kind: 'kw', title: 'if', text: 'Followed by a question whose answer is "yes" or "no".' },
      { id: 'cmp', side: 'l', kind: 'num', title: 'Comparison', text: '<code>&gt;=</code> greater than or equal. There are also <code>&lt;</code>, <code>&gt;</code>, <code>==</code> (equal), <code>!=</code> (not equal).' },
      { id: 'ind', side: 'l', kind: 'ui', title: 'Indentation', text: 'Four spaces. This is how Python knows which lines belong to the if.' },
      { id: 'colon', side: 'r', kind: 'kw', title: 'Colon', text: 'Opens the block. Without it you get a SyntaxError.' },
      { id: 'else', side: 'r', kind: 'kw', title: 'else', text: 'Runs when the condition was not true.' },
      { id: 'out', side: 'r', kind: 'out', title: 'One branch ran', text: '15 is less than 18, so the block after else ran.' },
    ],
    learn: [
      { h: 'A fork in the road', html: '<p class="lead">Sometimes a program has to do one thing or another. <code>if</code> checks a condition and runs the block only if the answer is "yes".</p>' },
      { h: 'Two equals signs', html: '<p><code>=</code> puts a value into a variable. <code>==</code> compares: <code>if answer == "yes":</code>. Everybody mixes them up at first, that is normal.</p>' },
      { h: 'More than two options', html: '<p>Between if and else you can add as many <code>elif</code> ("else if") as you need. Python checks them from top to bottom and runs the first one that fits.</p>' },
    ],
    task: {
      text: 'You have <code>t = 30</code>. If <code>t</code> is greater than 25, print <code>Hot</code>, otherwise <code>Cool</code>.',
      starter: 't = 30\n',
      expect: 'Hot',
      must: [{ re: '\\bif\\b', hint: 'The solution has to use <code>if</code>, not just print.' }, { re: '\\belse\\b', hint: 'Add an <code>else</code> branch for "Cool".' }],
      hint: '<code>if t &gt; 25:</code>, then on the next line 4 spaces and print.',
    },
  },
  {
    id: 'for',
    short: 'Loops',
    title: 'for: repeating without copy and paste',
    icon: 'loop',
    tone: 'kw',
    file: 'steps.py',
    code: [
      '[[for|for]] [[i|i]] in [[range|range(1, 4)]]:',
      '[[body|    print("Step", i)]]',
      '[[after|print("Done!")]]',
    ].join('\n'),
    output: 'Step 1\nStep 2\nStep 3\nDone!',
    annos: [
      { id: 'for', side: 'l', kind: 'kw', title: 'for', text: '"For each". Repeats the block once for every value.' },
      { id: 'i', side: 'l', kind: 'def', title: 'Counter', text: 'On every round <code>i</code> holds a new value: 1, then 2, then 3.' },
      { id: 'range', side: 'l', kind: 'bi', title: 'range', text: 'Numbers from 1 to 4, but 4 is not included. That is how range works.' },
      { id: 'body', side: 'r', kind: 'ui', title: 'Loop body', text: 'The indented lines are repeated.' },
      { id: 'after', side: 'r', kind: 'bi', title: 'After the loop', text: 'No indentation: runs once, when the rounds are over.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Three rounds and a finish', text: '' },
    ],
    learn: [
      { h: 'Why loops', html: '<p class="lead">Writing print a hundred times is boring. A loop repeats a block of code by itself, as many times as needed.</p>' },
      { h: 'range', html: '<p><code>range(5)</code> gives 0, 1, 2, 3, 4. <code>range(1, 6)</code> gives 1 to 5. The last number is never included.</p>' },
      { h: 'There is also while', html: '<p><code>while</code> repeats as long as a condition is true: <code>while lives &gt; 0:</code>. Handy when you do not know in advance how many rounds there will be.</p>' },
    ],
    task: {
      text: 'Use <code>for</code> to print the numbers from 1 to 5, each on its own line.',
      starter: '',
      expect: '1\n2\n3\n4\n5',
      must: [{ re: '\\bfor\\b', hint: 'Use a <code>for</code> loop, not five prints.' }],
      hint: '<code>for n in range(1, 6):</code> and inside it <code>print(n)</code>.',
    },
  },
  {
    id: 'lists',
    short: 'Lists',
    title: 'Lists: many values in one',
    icon: 'list',
    tone: 'str',
    file: 'fruits.py',
    code: [
      'fruits = [[br|["apple", "banana", "kiwi"]]]',
      'fruits.[[app|append]]("mango")',
      'print(fruits[[idx|[0]]])',
      'print([[len|len]](fruits))',
    ].join('\n'),
    output: 'apple\n4',
    annos: [
      { id: 'br', side: 'l', kind: 'str', title: 'List', text: 'Square brackets, items separated by commas. The order is kept.' },
      { id: 'app', side: 'l', kind: 'def', title: 'append', text: 'Adds an item to the end of the list. Now it holds 4 fruits.' },
      { id: 'idx', side: 'r', kind: 'num', title: 'Position', text: 'Counting starts at zero: <code>[0]</code> is the first, <code>[1]</code> the second.' },
      { id: 'len', side: 'r', kind: 'bi', title: 'len', text: 'Length: how many items are in the list.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Result', text: '' },
    ],
    learn: [
      { h: 'Why a list', html: '<p class="lead">When there are many values, like grades, names or shopping items, you do not need a variable for each one. They all go into one list.</p>' },
      { h: 'List + loop', html: '<p>The most common pair in Python:</p><p><code>for f in fruits:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print(f)</code></p><p>The loop goes through every item in turn.</p>' },
    ],
    task: {
      text: 'Make a list <code>nums</code> with the numbers 4, 8 and 15 and print their sum with the function <code>sum</code>.',
      starter: '',
      expect: '27',
      must: [{ re: '\\[', hint: 'First create the list in square brackets.' }, { re: 'sum\\s*\\(', hint: '<code>sum(nums)</code> works out the sum.' }],
      hint: '<code>nums = [4, 8, 15]</code>, then <code>print(sum(nums))</code>.',
    },
  },
  {
    id: 'func',
    short: 'Functions',
    title: 'Functions: your own command',
    icon: 'func',
    tone: 'def',
    file: 'greeting.py',
    code: [
      '[[def|def]] [[fname|greet]]([[param|name]]):',
      '    [[ret|return]] "Hello, " + name + "!"',
      '',
      'print([[call|greet("Anna")]])',
      'print(greet("Max"))',
    ].join('\n'),
    output: 'Hello, Anna!\nHello, Max!',
    annos: [
      { id: 'def', side: 'l', kind: 'kw', title: 'def', text: 'Short for define. This is how you create your own command.' },
      { id: 'fname', side: 'l', kind: 'def', title: 'Function name', text: 'You use it to call the function later, just like print.' },
      { id: 'param', side: 'l', kind: 'def', title: 'Parameter', text: 'What gets passed in. Each call can give a different value.' },
      { id: 'ret', side: 'r', kind: 'kw', title: 'return', text: 'Hands the result back to where the function was called.' },
      { id: 'call', side: 'r', kind: 'bi', title: 'Call', text: 'Same code, different data. Written once, used as often as you like.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Result', text: '' },
    ],
    learn: [
      { h: 'Your own command', html: '<p class="lead">A function is a piece of code with a name. You write it once and call it as often as you like, each time with new data.</p>' },
      { h: 'print or return', html: '<p><code>print</code> shows something to a person. <code>return</code> gives a value back to the program so it can keep working with it: add it, store it, compare it.</p>' },
    ],
    task: {
      text: 'Write a function <code>square(n)</code> that returns <code>n * n</code>, and print <code>square(7)</code>.',
      starter: 'def square(n):\n    \n',
      expect: '49',
      must: [{ re: '\\bdef\\s+square', hint: 'You need a function called <code>square</code>.' }, { re: '\\breturn\\b', hint: 'The function has to give the result back with <code>return</code>.' }],
      hint: 'Inside the function: <code>return n * n</code>. Then, without indentation: <code>print(square(7))</code>.',
    },
  },
];

window.CONTENT.en.soon = [
  { title: 'Dictionaries', short: 'Values by name instead of by position' },
  { title: 'Working with files', short: 'Reading and writing .txt' },
  { title: 'Mini project: guess the number', short: 'Everything together in one game' },
  { title: 'GitHub', short: 'Keeping your code online' },
];
