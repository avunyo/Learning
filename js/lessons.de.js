/* Lesson content (German). Same structure as lessons.ru.js, same lesson ids. */
window.CONTENT = window.CONTENT || {};
window.CONTENT.de = {};

window.CONTENT.de.start = {
  kicker: 'Wo du anfängst',
  title: 'So sieht der Ort aus, an dem Code entsteht',
  file: 'hallo.py',
  code: [
    '[[comment|# mein erstes Programm]]',
    '[[code|print]]("Hallo, Welt!")',
  ].join('\n'),
  output: 'Hallo, Welt!',
  annos: [
    { id: 'tab', side: 'l', kind: 'ui', mode: 'vscode', title: 'Code-Datei', text: 'Ein Programm steckt in einer ganz normalen Datei. Python-Dateien enden auf <code>.py</code>.' },
    { id: 'gutter', side: 'l', kind: 'ui', mode: 'vscode', title: 'Zeilennummern', text: 'Wenn etwas kaputtgeht, nennt dir Python die Nummer der Zeile mit dem Fehler.' },
    { id: 'title', side: 'l', kind: 'ui', mode: 'idle', title: 'Dateifenster', text: 'In IDLE: File → New File. Code schreiben und als <code>hallo.py</code> speichern.' },
    { id: 'comment', side: 'l', kind: 'com', title: 'Kommentar', text: 'Alles nach <code>#</code> überspringt Python. Das sind Notizen für Menschen.' },
    { id: 'run', side: 'r', kind: 'str', mode: 'vscode', title: 'Starten', text: 'Das Dreieck startet die Datei. Python liest den Code von oben nach unten.' },
    { id: 'menu-run', side: 'r', kind: 'str', mode: 'idle', title: 'Menü Run', text: 'Run → Run Module oder die Taste F5 startet die Datei.' },
    { id: 'code', side: 'r', kind: 'bi', title: 'Befehl', text: '<code>print</code> zeigt auf dem Bildschirm, was in den Klammern steht.' },
    { id: 'term', side: 'r', kind: 'out', mode: 'vscode', title: 'Terminal', text: 'Hier schreibt das Programm sein Ergebnis hin.' },
    { id: 'shell', side: 'r', kind: 'out', mode: 'idle', title: 'Shell-Fenster', text: 'Hier siehst du das Ergebnis. Nach <code>&gt;&gt;&gt;</code> kannst du Befehle einzeln eintippen.' },
  ],
  try: '# Drück auf „Ausführen“ und schau nach unten\nprint("Hallo, Welt!")\nprint("2 + 2 =", 2 + 2)\n',
  intro: `
    <h3>Was ist Python</h3>
    <p class="lead">Eine Sprache, mit der man dem Computer erklärt, was er tun soll. Viele lernen sie als erste, weil sich Python-Code fast wie normales Englisch liest.</p>
    <p>Mit Python schreibt man Spiele und Bots, wertet Daten aus, trainiert neuronale Netze und automatisiert langweilige Arbeit.</p>
    <h3>So lernst du hier</h3>
    <ol>
      <li>Schau dir das Schema an: die Beschriftungen erklären jeden Teil des Codes.</li>
      <li>Lies die kurze Erklärung rechts.</li>
      <li>Ändere den Code in „Probier es selbst“ und führ ihn aus.</li>
      <li>Löse die Aufgabe, dann bekommt die Lektion einen Haken.</li>
    </ol>`,
  choiceZero: { title: 'Ich fange bei null an', text: 'Wir beginnen mit der Installation' },
  choiceKnow: { title: 'Python ist schon installiert', text: 'Direkt zum ersten Programm' },
};

window.CONTENT.de.lessons = [
  {
    id: 'install',
    short: 'Python installieren',
    title: 'Python installieren und IDLE öffnen',
    icon: 'download',
    tone: 'def',
    mode: 'idle',
    file: 'test.py',
    code: [
      '[[p|print]]("Python läuft!")',
      'print([[math|2 + 2]])',
    ].join('\n'),
    output: 'Python läuft!\n4',
    annos: [
      { id: 'title', side: 'l', kind: 'ui', mode: 'idle', title: 'Python-Version', text: 'Im Titel steht die Version. Alles ab 3.10 passt.' },
      { id: 'tab', side: 'l', kind: 'ui', mode: 'vscode', title: 'Die Datei test.py', text: 'In VS Code: File → New File, dann mit der Endung <code>.py</code> speichern.' },
      { id: 'p', side: 'l', kind: 'bi', title: 'Erster Befehl', text: '<code>print</code> gibt den Text in Anführungszeichen aus.' },
      { id: 'math', side: 'r', kind: 'num', title: 'Python kann rechnen', text: 'Ohne Anführungszeichen ist <code>2 + 2</code> eine Rechnung, kein Text.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Ergebnis', text: 'Zwei Befehle, zwei Zeilen Ausgabe.' },
    ],
    learn: [
      { h: 'Python herunterladen', html: '<p>Öffne <a href="https://www.python.org/downloads/" target="_blank" rel="noopener">python.org/downloads</a> und klick auf den großen gelben Knopf Download Python.</p>' },
      { h: 'Ein wichtiges Häkchen', html: '<p>Setz unter Windows im ersten Fenster des Installers das Häkchen bei <code>Add python.exe to PATH</code> und klick dann auf Install Now. Ohne das Häkchen findet das Terminal Python später nicht.</p>' },
      { h: 'IDLE öffnen', html: '<p>IDLE wird mit Python installiert. Drück auf Start, tipp IDLE ein und öffne es. Es erscheint das Shell-Fenster mit <code>&gt;&gt;&gt;</code>: schreib <code>2 + 2</code> und drück Enter.</p><p>Für ein Programm mit mehreren Zeilen: File → New File, Datei speichern und F5 drücken.</p>' },
      { h: 'Und VS Code?', html: '<p>Das ist ein Editor für größere Projekte. Er ist kostenlos: lad ihn von <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">code.visualstudio.com</a> und installier die Python-Erweiterung. Zum Anfangen reicht IDLE völlig. Der Schalter über dem Schema zeigt beide Editoren.</p>' },
      { h: 'Lieber gar nichts installieren?', html: '<p class="note">Das Fenster „Probier es selbst“ unten führt echtes Python direkt im Browser aus. Du kannst alle Lektionen nur damit machen.</p>' },
    ],
    example: 'print("Python läuft!")\nprint(2 + 2)\n',
    task: {
      text: 'Lass Python selbst <code>7 + 3</code> ausrechnen und das Ergebnis anzeigen.',
      starter: 'print()\n',
      expect: '10',
      must: [{ re: '\\+', hint: 'Python soll rechnen: schreib genau 7 + 3 in die Klammern.' }],
      hint: 'In die Klammern, ohne Anführungszeichen: <code>print(7 + 3)</code>.',
    },
  },
  {
    id: 'print',
    short: 'Erstes Programm',
    title: 'print: das Programm spricht',
    icon: 'screen',
    tone: 'bi',
    file: 'hallo.py',
    code: [
      '[[p|print]]([[s|"Hallo!"]])',
      'print("Ich heiße", [[comma|"Anna"]])',
      'print([[math|3 * 4]])',
    ].join('\n'),
    output: 'Hallo!\nIch heiße Anna\n12',
    annos: [
      { id: 'p', side: 'l', kind: 'bi', title: 'print', text: 'Ein eingebauter Befehl. Alles in den Klammern erscheint auf dem Bildschirm.' },
      { id: 's', side: 'l', kind: 'str', title: 'String', text: 'Text in Anführungszeichen. Python gibt ihn genau so aus, wie er dasteht.' },
      { id: 'comma', side: 'r', kind: 'str', title: 'Mit Komma', text: 'Du kannst mehrere Teile übergeben. print setzt selbst ein Leerzeichen dazwischen.' },
      { id: 'math', side: 'r', kind: 'num', title: 'Rechnung', text: '<code>*</code> multipliziert, <code>/</code> teilt. Heraus kommt 12, nicht „3 * 4“.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Jedes print ist eine neue Zeile', text: 'Drei Befehle, drei Zeilen.' },
    ],
    learn: [
      { h: 'Was print macht', html: '<p class="lead">Ein Programm ist eine Liste von Befehlen. Der erste Befehl, den alle lernen, ist <code>print(...)</code>. Er zeigt auf dem Bildschirm, was du ihm in die Klammern gibst.</p>' },
      { h: 'Text und Zahlen', html: '<p>Text steht immer in Anführungszeichen: <code>"Hallo"</code>. Das nennt man String. Zahlen schreibt man ohne Anführungszeichen, und man kann mit ihnen rechnen: <code>+ - * /</code>.</p><p>Vergleich: <code>print("2 + 2")</code> gibt „2 + 2“ aus, <code>print(2 + 2)</code> gibt 4 aus.</p>' },
      { h: 'Häufige Fehler', html: '<ul><li>Anführungszeichen vergessen: <code>print("Hallo)</code></li><li>Klammer vergessen: <code>print("Hallo"</code></li><li>Großbuchstabe: <code>Print</code>. Python unterscheidet Groß- und Kleinschreibung, richtig ist <code>print</code>.</li></ul>' },
    ],
    task: {
      text: 'Gib zwei Zeilen aus: zuerst <code>Ich lerne Python</code>, darunter <code>Schritt 2</code>.',
      starter: '# zwei print-Befehle\n',
      expect: 'Ich lerne Python\nSchritt 2',
      hint: 'Zwei eigene Codezeilen, jede fängt mit <code>print(</code> an.',
    },
  },
  {
    id: 'vars',
    short: 'Variablen',
    title: 'Variablen: Werte merken',
    icon: 'box',
    tone: 'str',
    file: 'alter.py',
    code: [
      '[[name|name]] [[eq|=]] [[val|"Anna"]]',
      'alter = 15',
      'alter = [[upd|alter + 1]]',
      '[[use|print(name, "ist nächstes Jahr", alter)]]',
    ].join('\n'),
    output: 'Anna ist nächstes Jahr 16',
    annos: [
      { id: 'name', side: 'l', kind: 'def', title: 'Name der Variable', text: 'Den denkst du dir aus: lateinische Buchstaben, keine Leerzeichen. Besser verständlich: <code>alter</code>, nicht <code>x</code>.' },
      { id: 'eq', side: 'l', kind: 'kw', title: 'Das Zeichen =', text: 'Heißt nicht „gleich“, sondern „leg hinein“. Der Wert rechts kommt in den Namen links.' },
      { id: 'val', side: 'l', kind: 'str', title: 'Wert', text: 'Eine Variable kann Text, Zahlen und vieles mehr speichern.' },
      { id: 'upd', side: 'r', kind: 'num', title: 'Neuer Wert', text: 'Nimm, was in <code>alter</code> lag, zähl 1 dazu und leg es zurück.' },
      { id: 'use', side: 'r', kind: 'bi', title: 'Benutzen', text: 'Schreib den Namen ohne Anführungszeichen, dann setzt Python den Inhalt ein.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Ergebnis', text: 'Es war 15, jetzt ist es 16.' },
    ],
    learn: [
      { h: 'Eine Kiste mit Etikett', html: '<p class="lead">Eine Variable ist eine Kiste mit einem Namen. Du legst einmal einen Wert hinein und holst ihn dann über den Namen so oft heraus, wie du willst.</p><p><code>punkte = 0</code> heißt „mach eine Kiste namens punkte und leg 0 hinein“.</p>' },
      { h: 'Name mit und ohne Anführungszeichen', html: '<p><code>print(name)</code> zeigt, was in der Variable steckt. <code>print("name")</code> zeigt das Wort name selbst. Die Anführungszeichen machen den Unterschied.</p>' },
      { h: 'Werte können sich ändern', html: '<p>Code läuft von oben nach unten. Schreibst du weiter unten <code>alter = 20</code>, ersetzt der neue Wert den alten.</p>' },
    ],
    task: {
      text: 'Leg die Variablen <code>a = 5</code> und <code>b = 8</code> an und gib dann ihre Summe über die Variablennamen aus.',
      starter: 'a = 5\nb = 8\n',
      expect: '13',
      must: [{ re: 'print\\s*\\(\\s*a\\s*\\+\\s*b|print\\s*\\(\\s*b\\s*\\+\\s*a', hint: 'Addiere die Variablen selbst: <code>print(a + b)</code>.' }],
      hint: '<code>print(a + b)</code>',
    },
  },
  {
    id: 'input',
    short: 'Eingabe',
    title: 'input: das Programm stellt eine Frage',
    icon: 'keyboard',
    tone: 'bi',
    file: 'frage.py',
    code: [
      'name = [[inp|input]]([[q|"Wie heißt du? "]])',
      'print("Hallo,", name)',
      'jahr = [[int|int]](input("Geburtsjahr? "))',
      'print("2030 bist du", [[calc|2030 - jahr]])',
    ].join('\n'),
    output: 'Wie heißt du? Anna\nHallo, Anna\nGeburtsjahr? 2011\n2030 bist du 19',
    annos: [
      { id: 'inp', side: 'l', kind: 'bi', title: 'input', text: 'Das Programm hält an und wartet, bis jemand eine Antwort tippt und Enter drückt.' },
      { id: 'q', side: 'l', kind: 'str', title: 'Frage', text: 'Der Text in den Klammern steht vor der Antwort. Das Leerzeichen am Ende hält beides auseinander.' },
      { id: 'int', side: 'l', kind: 'bi', title: 'int', text: 'input liefert immer Text. <code>int(...)</code> macht daraus eine Zahl, mit der man rechnen kann.' },
      { id: 'calc', side: 'r', kind: 'num', title: 'Rechnen', text: 'Jetzt ist <code>jahr</code> eine Zahl, und die Subtraktion klappt.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Ein Gespräch', text: 'Fragen des Programms und Antworten des Menschen wechseln sich ab.' },
    ],
    learn: [
      { h: 'Das Programm hört zu', html: '<p class="lead"><code>input()</code> pausiert das Programm und wartet auf eine Antwort über die Tastatur. Was getippt wird, kommt zurück.</p><p>In diesem Fenster zeigt der Browser ein kleines Eingabefenster.</p>' },
      { h: 'Text oder Zahl', html: '<p>Die Antwort von input ist immer ein String, auch wenn Ziffern getippt wurden. <code>"5" + "5"</code> ergibt <code>"55"</code>, nicht 10. Darum liest man Zahlen mit <code>int(input())</code> ein.</p>' },
    ],
    task: {
      text: 'Frag nach einer Zahl und gib sie mal 2 aus. Die Prüfung tippt die Zahl 21 ein.',
      starter: 'n = int(input("Gib eine Zahl ein: "))\n',
      inputs: ['21'],
      includes: '42',
      must: [{ re: 'input\\s*\\(', hint: 'Hol die Zahl mit <code>input</code>.' }],
      hint: '<code>print(n * 2)</code>',
    },
  },
  {
    id: 'if',
    short: 'Bedingungen',
    title: 'if: das Programm entscheidet',
    icon: 'fork',
    tone: 'kw',
    file: 'wahl.py',
    code: [
      'alter = 15',
      '[[if|if]] alter [[cmp|>=]] 18[[colon|:]]',
      '[[ind|    ]]print("Du darfst wählen")',
      '[[else|else]]:',
      '    print("Noch zu früh")',
    ].join('\n'),
    output: 'Noch zu früh',
    annos: [
      { id: 'if', side: 'l', kind: 'kw', title: 'if', text: 'Englisch für „wenn“. Danach kommt eine Frage mit der Antwort „ja“ oder „nein“.' },
      { id: 'cmp', side: 'l', kind: 'num', title: 'Vergleich', text: '<code>&gt;=</code> größer oder gleich. Außerdem gibt es <code>&lt;</code>, <code>&gt;</code>, <code>==</code> (gleich), <code>!=</code> (ungleich).' },
      { id: 'ind', side: 'l', kind: 'ui', title: 'Einrückung', text: 'Vier Leerzeichen. So weiß Python, welche Zeilen zum if gehören.' },
      { id: 'colon', side: 'r', kind: 'kw', title: 'Doppelpunkt', text: 'Öffnet den Block. Ohne ihn gibt es einen SyntaxError.' },
      { id: 'else', side: 'r', kind: 'kw', title: 'else', text: '„Sonst“. Läuft, wenn die Bedingung nicht gestimmt hat.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Ein Zweig ist gelaufen', text: '15 ist kleiner als 18, also lief der Block nach else.' },
    ],
    learn: [
      { h: 'Eine Weggabelung', html: '<p class="lead">Manchmal soll ein Programm entweder das eine oder das andere tun. <code>if</code> prüft eine Bedingung und führt den Block nur aus, wenn die Antwort „ja“ ist.</p>' },
      { h: 'Zwei Gleichheitszeichen', html: '<p><code>=</code> legt einen Wert in eine Variable. <code>==</code> vergleicht: <code>if antwort == "ja":</code>. Das verwechseln am Anfang alle, das ist normal.</p>' },
      { h: 'Mehr als zwei Möglichkeiten', html: '<p>Zwischen if und else kannst du beliebig viele <code>elif</code> („sonst wenn“) einfügen. Python prüft sie von oben nach unten und führt die erste passende aus.</p>' },
    ],
    task: {
      text: 'Es gibt <code>t = 30</code>. Wenn <code>t</code> größer als 25 ist, gib <code>Heiß</code> aus, sonst <code>Kühl</code>.',
      starter: 't = 30\n',
      expect: 'Heiß',
      must: [{ re: '\\bif\\b', hint: 'Die Lösung soll <code>if</code> benutzen, nicht nur print.' }, { re: '\\belse\\b', hint: 'Füg einen <code>else</code>-Zweig für „Kühl“ hinzu.' }],
      hint: '<code>if t &gt; 25:</code>, in der nächsten Zeile 4 Leerzeichen und print.',
    },
  },
  {
    id: 'for',
    short: 'Schleifen',
    title: 'for: wiederholen ohne Kopieren',
    icon: 'loop',
    tone: 'kw',
    file: 'schritte.py',
    code: [
      '[[for|for]] [[i|i]] in [[range|range(1, 4)]]:',
      '[[body|    print("Schritt", i)]]',
      '[[after|print("Fertig!")]]',
    ].join('\n'),
    output: 'Schritt 1\nSchritt 2\nSchritt 3\nFertig!',
    annos: [
      { id: 'for', side: 'l', kind: 'kw', title: 'for', text: '„Für jedes“. Wiederholt den Block einmal für jeden Wert.' },
      { id: 'i', side: 'l', kind: 'def', title: 'Zähler', text: 'In jeder Runde steht in <code>i</code> ein neuer Wert: 1, dann 2, dann 3.' },
      { id: 'range', side: 'l', kind: 'bi', title: 'range', text: 'Zahlen von 1 bis 4, aber 4 ist nicht dabei. So funktioniert range.' },
      { id: 'body', side: 'r', kind: 'ui', title: 'Schleifenkörper', text: 'Die eingerückten Zeilen werden wiederholt.' },
      { id: 'after', side: 'r', kind: 'bi', title: 'Nach der Schleife', text: 'Ohne Einrückung: läuft einmal, wenn die Runden vorbei sind.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Drei Runden und Schluss', text: '' },
    ],
    learn: [
      { h: 'Wozu Schleifen', html: '<p class="lead">Hundertmal print zu schreiben ist langweilig. Eine Schleife wiederholt einen Codeblock von selbst, so oft wie nötig.</p>' },
      { h: 'range', html: '<p><code>range(5)</code> liefert 0, 1, 2, 3, 4. <code>range(1, 6)</code> liefert 1 bis 5. Die letzte Zahl ist nie dabei.</p>' },
      { h: 'Es gibt auch while', html: '<p><code>while</code> wiederholt, solange eine Bedingung stimmt: <code>while leben &gt; 0:</code>. Praktisch, wenn man vorher nicht weiß, wie viele Runden es werden.</p>' },
    ],
    task: {
      text: 'Gib mit <code>for</code> die Zahlen von 1 bis 5 aus, jede in einer eigenen Zeile.',
      starter: '',
      expect: '1\n2\n3\n4\n5',
      must: [{ re: '\\bfor\\b', hint: 'Benutze eine <code>for</code>-Schleife, nicht fünfmal print.' }],
      hint: '<code>for n in range(1, 6):</code> und darin <code>print(n)</code>.',
    },
  },
  {
    id: 'lists',
    short: 'Listen',
    title: 'Listen: viele Werte in einem',
    icon: 'list',
    tone: 'str',
    file: 'obst.py',
    code: [
      'obst = [[br|["Apfel", "Banane", "Kiwi"]]]',
      'obst.[[app|append]]("Mango")',
      'print(obst[[idx|[0]]])',
      'print([[len|len]](obst))',
    ].join('\n'),
    output: 'Apfel\n4',
    annos: [
      { id: 'br', side: 'l', kind: 'str', title: 'Liste', text: 'Eckige Klammern, Elemente durch Kommas getrennt. Die Reihenfolge bleibt erhalten.' },
      { id: 'app', side: 'l', kind: 'def', title: 'append', text: 'Hängt ein Element ans Ende der Liste. Jetzt sind 4 Obstsorten drin.' },
      { id: 'idx', side: 'r', kind: 'num', title: 'Position', text: 'Gezählt wird ab null: <code>[0]</code> ist das erste, <code>[1]</code> das zweite.' },
      { id: 'len', side: 'r', kind: 'bi', title: 'len', text: 'Länge: wie viele Elemente in der Liste sind.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Ergebnis', text: '' },
    ],
    learn: [
      { h: 'Wozu eine Liste', html: '<p class="lead">Wenn es viele Werte gibt, etwa Noten, Namen oder Einkäufe, brauchst du nicht für jeden eine eigene Variable. Sie kommen alle in eine Liste.</p>' },
      { h: 'Liste + Schleife', html: '<p>Das häufigste Paar in Python:</p><p><code>for o in obst:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print(o)</code></p><p>Die Schleife geht der Reihe nach durch jedes Element.</p>' },
    ],
    task: {
      text: 'Mach eine Liste <code>zahlen</code> mit 4, 8 und 15 und gib ihre Summe mit der Funktion <code>sum</code> aus.',
      starter: '',
      expect: '27',
      must: [{ re: '\\[', hint: 'Leg zuerst die Liste in eckigen Klammern an.' }, { re: 'sum\\s*\\(', hint: 'Die Summe berechnet <code>sum(zahlen)</code>.' }],
      hint: '<code>zahlen = [4, 8, 15]</code>, dann <code>print(sum(zahlen))</code>.',
    },
  },
  {
    id: 'func',
    short: 'Funktionen',
    title: 'Funktionen: dein eigener Befehl',
    icon: 'func',
    tone: 'def',
    file: 'gruss.py',
    code: [
      '[[def|def]] [[fname|gruss]]([[param|name]]):',
      '    [[ret|return]] "Hallo, " + name + "!"',
      '',
      'print([[call|gruss("Anna")]])',
      'print(gruss("Max"))',
    ].join('\n'),
    output: 'Hallo, Anna!\nHallo, Max!',
    annos: [
      { id: 'def', side: 'l', kind: 'kw', title: 'def', text: 'Kurz für define, „festlegen“. So legst du einen eigenen Befehl an.' },
      { id: 'fname', side: 'l', kind: 'def', title: 'Name der Funktion', text: 'Damit rufst du die Funktion später auf, genau wie print.' },
      { id: 'param', side: 'l', kind: 'def', title: 'Parameter', text: 'Das, was hineingegeben wird. Bei jedem Aufruf kann es etwas anderes sein.' },
      { id: 'ret', side: 'r', kind: 'kw', title: 'return', text: 'Gibt das Ergebnis dorthin zurück, wo die Funktion aufgerufen wurde.' },
      { id: 'call', side: 'r', kind: 'bi', title: 'Aufruf', text: 'Gleicher Code, andere Daten. Einmal geschrieben, beliebig oft benutzt.' },
      { id: 'out', side: 'r', kind: 'out', title: 'Ergebnis', text: '' },
    ],
    learn: [
      { h: 'Dein eigener Befehl', html: '<p class="lead">Eine Funktion ist ein Stück Code mit einem Namen. Du schreibst sie einmal und rufst sie so oft auf, wie du willst, jedes Mal mit neuen Daten.</p>' },
      { h: 'print oder return', html: '<p><code>print</code> zeigt etwas einem Menschen. <code>return</code> gibt einen Wert an das Programm zurück, damit es damit weiterarbeiten kann: addieren, speichern, vergleichen.</p>' },
    ],
    task: {
      text: 'Schreib eine Funktion <code>quadrat(n)</code>, die <code>n * n</code> zurückgibt, und gib <code>quadrat(7)</code> aus.',
      starter: 'def quadrat(n):\n    \n',
      expect: '49',
      must: [{ re: '\\bdef\\s+quadrat', hint: 'Du brauchst eine Funktion namens <code>quadrat</code>.' }, { re: '\\breturn\\b', hint: 'Die Funktion soll das Ergebnis mit <code>return</code> zurückgeben.' }],
      hint: 'In der Funktion: <code>return n * n</code>. Danach ohne Einrückung: <code>print(quadrat(7))</code>.',
    },
  },
];

window.CONTENT.de.soon = [
  { title: 'Dictionaries', short: 'Werte über Namen statt über Nummern' },
  { title: 'Mit Dateien arbeiten', short: '.txt lesen und schreiben' },
  { title: 'Miniprojekt: Zahlenraten', short: 'Alles zusammen in einem Spiel' },
  { title: 'GitHub', short: 'Deinen Code online speichern' },
];
