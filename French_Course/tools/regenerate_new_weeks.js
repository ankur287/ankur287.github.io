const fs = require('fs');
const path = require('path');

const root = process.cwd();

const sharedReview = [
  { french: 'je suis', english: 'I am', phonetic: 'zhuh swee', topic: 'review: etre', example: 'Je suis en classe avec Samira.', exampleEnglish: 'I am in class with Samira.' },
  { french: "j'ai", english: 'I have', phonetic: 'zhay', topic: 'review: avoir', example: "J'ai un cahier et un stylo.", exampleEnglish: 'I have a notebook and a pen.' },
  { french: 'bonjour', english: 'hello', phonetic: 'bohn-ZHOOR', topic: 'review: greeting', example: "Bonjour, je m'appelle Alex.", exampleEnglish: 'Hello, my name is Alex.' },
  { french: 'la famille', english: 'family', phonetic: 'lah fah-MEE', topic: 'review: family', example: 'La famille de Marc est au cafe.', exampleEnglish: "Marc's family is at the cafe." },
  { french: 'le cafe', english: 'cafe', phonetic: 'luh kah-FAY', topic: 'review: place', example: 'Samira prend un cafe au cafe.', exampleEnglish: 'Samira has a coffee at the cafe.' },
  { french: 'le bus', english: 'bus', phonetic: 'luh boos', topic: 'review: transport', example: 'Alex prend le bus pour aller en classe.', exampleEnglish: 'Alex takes the bus to go to class.' },
  { french: 'aujourd hui', english: 'today', phonetic: 'oh-zhoor-DWEE', topic: 'review: time', example: "Aujourd'hui, il fait froid.", exampleEnglish: 'Today, it is cold.' },
  { french: 'une petite table', english: 'a small table', phonetic: 'oon puh-TEET tahbl', topic: 'review: adjectives', example: 'Il y a une petite table dans la cuisine.', exampleEnglish: 'There is a small table in the kitchen.' },
  { french: 'mon livre', english: 'my book', phonetic: 'mohn leevr', topic: 'review: possessives', example: 'Mon livre est sur le bureau.', exampleEnglish: 'My book is on the desk.' },
  { french: 'du pain', english: 'some bread', phonetic: 'doo pan', topic: 'review: food', example: 'Je voudrais du pain et de l eau.', exampleEnglish: 'I would like some bread and water.' },
  { french: 'ou est-ce que', english: 'where is it that', phonetic: 'oo ess-kuh', topic: 'review: questions', example: 'Ou est-ce que Madame Dupont travaille ?', exampleEnglish: 'Where does Madame Dupont work?' },
  { french: 'je me prepare', english: 'I get ready', phonetic: 'zhuh muh pray-PAHR', topic: 'review: routine', example: 'Le matin, je me prepare dans ma chambre.', exampleEnglish: 'In the morning, I get ready in my bedroom.' }
];

function t(french, english, topic, example, exampleEnglish, phonetic = 'listen and repeat', article = '') {
  return { french, english, topic, example, exampleEnglish, phonetic, article };
}

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === ',') {
      cells.push(cell);
      cell = '';
    } else if (ch === '"') {
      quoted = true;
    } else {
      cell += ch;
    }
  }
  cells.push(cell);
  return cells;
}

function readVocabularyRows() {
  const file = path.join(root, 'vocabulary_bank.csv');
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines.shift() || '');
  return lines.map(line => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(header.map((h, i) => [h, cells[i] || '']));
  });
}

const originalVocabularyRows = readVocabularyRows();

function csvRowsToVocab(week) {
  return originalVocabularyRows
    .filter(row => Number(row.week_introduced) === week)
    .map(row => t(
      row.french,
      row.english,
      row.topic || 'core',
      row.example_french,
      row.example_english,
      row.phonetic || 'listen and repeat',
      row.article || ''
    ));
}

const weeks = {
  1: {
    title: 'Bonjour, je suis Alex',
    main: 'subject pronouns and etre basics',
    review: 'foundation week: pronunciation, classroom routines, and memory habits',
    newLabel: 'greetings, names, courtesy words, days, months, classroom words, and etre chunks',
    goal: 'introduce yourself, recognize classroom people and objects, and write a short controlled profile.',
    grammarRows: [
      ['je suis', 'I am for identity or location', 'Je suis Alex.'],
      ['tu es', 'you are for a familiar person', 'Tu es Samira.'],
      ['il est / elle est', 'he is / she is', 'Il est Marc. Elle est Madame Dupont.'],
      ['nous sommes', 'we are', 'Nous sommes en classe.'],
      ['vous etes', 'you are, formal or plural', 'Vous etes Madame Dupont.'],
      ['ils/elles sont', 'they are', 'Ils sont en classe.']
    ],
    watch: 'Do not translate word by word. Learn small complete chunks first: je suis, tu es, il est, elle est, nous sommes.',
    reading: "Bonjour, je m'appelle Alex. Je suis en classe avec Samira et Marc. Madame Dupont est la professeure. Nous sommes ici lundi. La classe est calme et la phrase est simple. Sur la table, il y a un tableau, une porte, un livre et un stylo. Aujourd'hui, je lis, j'ecoute et j'ecris une phrase courte.",
    readingEnglish: 'Alex introduces the class, the people, and simple classroom words with etre.',
    listening: "Madame Dupont dit : Bonjour, je suis Madame Dupont. Alex repond : Bonjour, je m'appelle Alex. Samira est ici. Marc est en classe. Nous sommes prets.",
    writingTest: 'Write 5-7 short sentences introducing yourself. Use je m appelle, je suis, one person, one place, one day, and one classroom word.',
    model: "Bonjour, je m'appelle Alex. Je suis en classe. Samira est une amie. Marc est ici. Madame Dupont est la professeure. Nous sommes en classe lundi. La phrase est courte.",
    vocab: csvRowsToVocab(1)
  },
  2: {
    title: "J'ai dix ans",
    main: 'avoir basics and age',
    review: 'etre, greetings, classroom words, days, and months from Week 1',
    newLabel: 'avoir, age, numbers, family basics, common objects, personal information, and simple negation',
    goal: 'write a short personal profile with identity, age, family/object details, and one negative sentence.',
    grammarRows: [
      ["j'ai", 'I have / I am for age', "J'ai dix ans."],
      ['tu as', 'you have', 'Tu as un telephone.'],
      ['il/elle a', 'he/she has', 'Elle a une soeur.'],
      ['nous avons', 'we have', 'Nous avons un livre.'],
      ['je n ai pas de', 'I do not have any', "Je n'ai pas de telephone."],
      ['etre + avoir contrast', 'identity vs possession', "Je suis Alex. J'ai un cahier."]
    ],
    watch: 'Use avoir for age in French: j ai dix ans. Use etre for identity: je suis Alex.',
    reading: "Bonjour, je m'appelle Alex. Je suis en classe avec Samira. J'ai dix ans dans l'exemple de la lecon et j'ai un cahier, un stylo et une cle dans mon sac. Samira a une question et Marc a une reponse. Madame Dupont est la professeure; elle a le livre de la classe. Nous sommes ici lundi et nous avons beaucoup de mots utiles.",
    readingEnglish: 'Alex adds avoir, age, objects, and simple personal details to Week 1 identity language.',
    listening: "Samira dit : Bonjour, je suis Samira et j'ai un livre. Alex repond : J'ai un cahier, mais je n'ai pas de telephone. Madame Dupont a la reponse.",
    writingTest: 'Write 6-8 profile sentences. Use je m appelle, je suis, j ai, one age sentence, one object, one family word, and one je n ai pas sentence.',
    model: "Bonjour, je m'appelle Alex. Je suis en classe. J'ai dix ans dans l'exemple. J'ai un cahier et un stylo. Samira a une question. Marc a une reponse. Je n'ai pas de telephone. Nous sommes ici lundi.",
    vocab: csvRowsToVocab(2)
  },
  3: {
    title: 'Un livre, une lampe',
    main: 'definite and indefinite articles with gender awareness',
    review: 'etre and avoir in descriptions of things people have',
    newLabel: 'articles, classroom nouns, and household nouns',
    goal: 'describe what Alex, Samira, and Marc have in a room using un, une, le, la, les, and des.',
    grammarRows: [
      ['un', 'a/an before a masculine singular noun', 'un livre'],
      ['une', 'a/an before a feminine singular noun', 'une lampe'],
      ['le / la', 'the before masculine / feminine singular nouns', 'le bureau / la table'],
      ["l'", 'the before a vowel sound', "l'ordinateur"],
      ['les / des', 'the plural / some plural', 'les livres / des cahiers']
    ],
    watch: 'Learn each noun with its article. English does not show noun gender, so memorize un livre and une lampe as whole chunks.',
    reading: "Bonjour, je m'appelle Samira. Je suis en classe avec Alex et Marc. Sur la table, il y a un livre, une lampe, un cahier et des stylos. Alex a le livre bleu. Marc a une cle dans son sac. Madame Dupont a les cahiers pour la classe. Dans la chambre d'Alex, il y a une table pres du lit et l'ordinateur est sur le bureau. Aujourd'hui, nous revisons etre et avoir avec les nouveaux articles.",
    readingEnglish: 'Samira describes class and Alex’s room using articles with familiar people and objects.',
    listening: "Madame Dupont dit : Bonjour Alex. Est-ce que tu as un cahier ? Alex repond : Oui, j'ai un cahier et une petite cle. Samira a le livre, et Marc a les stylos. La lampe est sur la table.",
    writingTest: 'Write 6 sentences describing items in your room or class. Use at least four articles and two older verbs: etre and avoir.',
    model: "Bonjour, je m'appelle Alex. J'ai un livre et une lampe. Le livre est sur la table. La lampe est pres du lit. Samira a des stylos. Nous sommes en classe lundi.",
    vocab: [
      t('un', 'a / an masculine', 'articles', "J'ai un livre dans mon sac.", 'I have a book in my bag.'),
      t('une', 'a / an feminine', 'articles', 'Samira a une lampe sur la table.', 'Samira has a lamp on the table.'),
      t('le', 'the masculine', 'articles', 'Le livre est sur le bureau.', 'The book is on the desk.'),
      t('la', 'the feminine', 'articles', 'La lampe est pres du lit.', 'The lamp is near the bed.'),
      t("l'", 'the before vowel', 'articles', "L'ordinateur est dans la classe.", 'The computer is in the class.'),
      t('les', 'the plural', 'articles', 'Les stylos sont sur la table.', 'The pens are on the table.'),
      t('des', 'some / plural a', 'articles', "J'ai des cahiers pour la classe.", 'I have some notebooks for class.'),
      t('livre', 'book', 'classroom', 'Alex a un livre bleu.', 'Alex has a blue book.', 'leevr', 'un'),
      t('lampe', 'lamp', 'home', 'La lampe est dans la chambre.', 'The lamp is in the bedroom.', 'lahmp', 'une'),
      t('table', 'table', 'home', 'Une table est pres de la fenetre.', 'A table is near the window.', 'TAHBL', 'une'),
      t('bureau', 'desk / office', 'home', 'Le bureau de Madame Dupont est propre.', "Madame Dupont's desk is clean.", 'boo-ROH', 'un'),
      t('chaise', 'chair', 'home', 'La chaise est a cote de la table.', 'The chair is beside the table.', 'shehz', 'une'),
      t('lit', 'bed', 'home', 'Le lit est dans la chambre.', 'The bed is in the bedroom.', 'lee', 'un'),
      t('chambre', 'bedroom', 'home', "Dans ma chambre, j'ai une lampe.", 'In my bedroom, I have a lamp.', 'SHAHMBR', 'une'),
      t('cuisine', 'kitchen', 'home', 'La cuisine est petite.', 'The kitchen is small.', 'kwee-ZEEN', 'une'),
      t('salon', 'living room', 'home', 'Le salon est calme.', 'The living room is calm.', 'sah-LOHN', 'un'),
      t('fenetre', 'window', 'home', 'La fenetre est ouverte.', 'The window is open.', 'fuh-NEHTR', 'une'),
      t('porte', 'door', 'home', 'La porte est fermee.', 'The door is closed.', 'port', 'une'),
      t('cle', 'key', 'home', "J'ai une cle dans mon sac.", 'I have a key in my bag.', 'klay', 'une'),
      t('sac', 'bag', 'classroom', 'Marc a un sac noir.', 'Marc has a black bag.', 'sak', 'un'),
      t('cahier', 'notebook', 'classroom', 'Le cahier est sur le bureau.', 'The notebook is on the desk.', 'kah-YAY', 'un'),
      t('stylo', 'pen', 'classroom', "J'ai des stylos pour la classe.", 'I have pens for class.', 'stee-LOH', 'un'),
      t('ordinateur', 'computer', 'classroom', "L'ordinateur est a cote du livre.", 'The computer is next to the book.', 'or-dee-nah-TUHR', 'un'),
      t('telephone', 'phone', 'objects', 'Le telephone de Samira est dans son sac.', "Samira's phone is in her bag.", 'tay-lay-FOHN', 'un'),
      t('sur', 'on', 'place', 'Le livre est sur la table.', 'The book is on the table.'),
      t('dans', 'in', 'place', 'La cle est dans le sac.', 'The key is in the bag.'),
      t('pres de', 'near', 'place', 'La lampe est pres du lit.', 'The lamp is near the bed.'),
      t('a cote de', 'next to', 'place', "La chaise est a cote de la table.", 'The chair is next to the table.'),
      t('devant', 'in front of', 'place', 'Marc est devant la porte.', 'Marc is in front of the door.'),
      t('derriere', 'behind', 'place', 'Le sac est derriere la chaise.', 'The bag is behind the chair.')
    ]
  },
  4: {
    title: 'Une petite lampe rouge',
    main: 'adjective agreement basics',
    review: 'articles and gender from Week 3',
    newLabel: 'colors, size, and common adjectives',
    goal: 'describe people, rooms, and objects with adjective forms that match the noun.',
    grammarRows: [
      ['masculine singular', 'base adjective form', 'un petit livre rouge'],
      ['feminine singular', 'often add -e', 'une petite lampe rouge'],
      ['masculine plural', 'often add -s', 'des petits livres rouges'],
      ['feminine plural', 'often add -es', 'des petites lampes rouges']
    ],
    watch: 'Put most color adjectives after the noun. Petit and grand usually go before the noun.',
    reading: "Samira visite la chambre d'Alex. La chambre est petite mais claire. Sur le bureau, il y a un livre rouge, un cahier vert et une lampe jaune. La table est blanche. Le sac de Marc est noir et son telephone est gris. Madame Dupont dit que la classe est propre et calme. Alex est content parce qu'il peut decrire la chambre avec les articles et les adjectifs.",
    readingEnglish: 'Samira visits Alex’s room and describes objects with color and size adjectives.',
    listening: "Marc dit : J'ai un petit sac noir et une grande chemise bleue. Samira repond : Ma lampe est jaune, mon cahier est vert, et la table de la classe est blanche.",
    writingTest: 'Write 7 sentences describing one person and one room. Use five adjectives and at least three articles.',
    model: "Samira est contente. Elle a un petit sac noir. Dans sa chambre, il y a une lampe jaune. La table est blanche et propre. Le livre rouge est sur le bureau. Marc a une grande chaise bleue. La chambre est calme.",
    vocab: [
      t('petit / petite', 'small', 'size', "J'ai une petite cle dans mon sac.", 'I have a small key in my bag.'),
      t('grand / grande', 'big / tall', 'size', 'Le bureau est grand.', 'The desk is big.'),
      t('rouge', 'red', 'color', 'Alex a un livre rouge.', 'Alex has a red book.'),
      t('bleu / bleue', 'blue', 'color', 'Samira porte une chemise bleue.', 'Samira wears a blue shirt.'),
      t('vert / verte', 'green', 'color', 'Le cahier vert est sur la table.', 'The green notebook is on the table.'),
      t('jaune', 'yellow', 'color', 'La lampe jaune est pres du lit.', 'The yellow lamp is near the bed.'),
      t('blanc / blanche', 'white', 'color', 'La table blanche est propre.', 'The white table is clean.'),
      t('noir / noire', 'black', 'color', 'Marc a un sac noir.', 'Marc has a black bag.'),
      t('gris / grise', 'gray', 'color', 'Le telephone est gris.', 'The phone is gray.'),
      t('propre', 'clean', 'description', 'La classe est propre.', 'The classroom is clean.'),
      t('sale', 'dirty', 'description', "La tasse n'est pas propre; elle est sale.", 'The cup is not clean; it is dirty.'),
      t('facile', 'easy', 'description', 'La question est facile.', 'The question is easy.'),
      t('difficile', 'difficult', 'description', "L'exercice est difficile mais utile.", 'The exercise is difficult but useful.'),
      t('clair / claire', 'clear / bright', 'description', 'La phrase est claire.', 'The sentence is clear.'),
      t('sombre', 'dark', 'description', 'La chambre est sombre le soir.', 'The room is dark in the evening.'),
      t('joli / jolie', 'pretty', 'description', 'La photo de famille est jolie.', 'The family photo is pretty.'),
      t('nouveau / nouvelle', 'new', 'description', 'Samira a une nouvelle lampe.', 'Samira has a new lamp.'),
      t('bon / bonne', 'good', 'description', "C'est une bonne reponse.", 'It is a good answer.'),
      t('mauvais / mauvaise', 'bad', 'description', "Ce n'est pas une mauvaise idee.", 'It is not a bad idea.'),
      t('long / longue', 'long', 'description', 'La phrase est longue.', 'The sentence is long.'),
      t('court / courte', 'short', 'description', 'Le texte est court.', 'The text is short.'),
      t('tres', 'very', 'degree', 'La chambre est tres claire.', 'The room is very bright.'),
      t('un peu', 'a little', 'degree', 'Le cafe est un peu chaud.', 'The coffee is a little hot.'),
      t('trop', 'too / too much', 'degree', 'La question est trop longue.', 'The question is too long.'),
      t('assez', 'enough / quite', 'degree', 'Le texte est assez facile.', 'The text is quite easy.'),
      t('couleur', 'color', 'description', 'Quelle couleur est la lampe ?', 'What color is the lamp?', 'koo-LUHR', 'une'),
      t('taille', 'size', 'description', 'Quelle taille est la table ?', 'What size is the table?', 'tahy', 'une'),
      t('pret / prete', 'ready', 'description', 'Nous sommes prets pour le quiz.', 'We are ready for the quiz.'),
      t('content / contente', 'happy', 'description', 'Samira est contente en classe.', 'Samira is happy in class.'),
      t('fatigue / fatiguee', 'tired', 'description', 'Alex est fatigue le soir.', 'Alex is tired in the evening.')
    ]
  },
  5: {
    title: 'Ma famille, mon livre',
    main: 'possessive adjectives',
    review: 'adjective agreement with family and objects',
    newLabel: 'family relationships and possessives',
    goal: 'describe family members and belongings using mon, ma, mes, son, sa, ses, notre, and nos.',
    grammarRows: [
      ['mon', 'my before masculine noun or vowel sound', 'mon pere / mon amie'],
      ['ma', 'my before feminine consonant sound', 'ma mere'],
      ['mes', 'my before plural nouns', 'mes parents'],
      ['son / sa / ses', 'his, her, or its according to the noun', 'son frere / sa soeur / ses enfants'],
      ['notre / nos', 'our singular / plural', 'notre famille / nos cahiers']
    ],
    watch: 'In French, son and sa match the noun, not the owner. Son frere can mean his brother or her brother.',
    reading: "Alex presente sa famille a Samira. Sa mere est calme et son pere est professeur. Son frere a un petit sac noir et sa soeur a une lampe jaune dans sa chambre. Les parents d'Alex habitent pres du parc. Madame Dupont demande : Est-ce que ta famille parle francais a la maison ? Alex repond : Oui, un peu. Notre famille revise les mots ensemble le dimanche.",
    readingEnglish: 'Alex introduces his family and uses possessives with older adjectives and articles.',
    listening: "Samira dit : Ma mere travaille au bureau et mon pere prend le bus. Mes parents sont gentils. Marc repond : Notre famille mange souvent au cafe le samedi.",
    writingTest: 'Write 8 sentences about your family or a chosen family. Use mon, ma, mes, son, sa, ses, notre, and at least three adjectives.',
    model: "Ma famille est petite. Ma mere est calme et mon pere est gentil. Mon frere a un sac noir. Ma soeur a une lampe jaune. Mes parents habitent pres du parc. Notre maison est claire. Samira connait ma famille. Nous sommes contents.",
    vocab: [
      t('mon', 'my masculine', 'possessives', 'Mon livre est sur le bureau.', 'My book is on the desk.'),
      t('ma', 'my feminine', 'possessives', 'Ma lampe est jaune.', 'My lamp is yellow.'),
      t('mes', 'my plural', 'possessives', 'Mes cahiers sont dans mon sac.', 'My notebooks are in my bag.'),
      t('ton', 'your masculine informal', 'possessives', 'Ton sac est noir.', 'Your bag is black.'),
      t('ta', 'your feminine informal', 'possessives', 'Ta chambre est claire.', 'Your bedroom is bright.'),
      t('tes', 'your plural informal', 'possessives', 'Tes stylos sont rouges.', 'Your pens are red.'),
      t('son', 'his/her masculine', 'possessives', 'Son frere est en classe.', 'His/her brother is in class.'),
      t('sa', 'his/her feminine', 'possessives', 'Sa soeur est au cafe.', 'His/her sister is at the cafe.'),
      t('ses', 'his/her plural', 'possessives', 'Ses parents sont gentils.', 'His/her parents are kind.'),
      t('notre', 'our singular', 'possessives', 'Notre famille est petite.', 'Our family is small.'),
      t('nos', 'our plural', 'possessives', 'Nos livres sont sur la table.', 'Our books are on the table.'),
      t('famille', 'family', 'family', 'La famille Martin habite pres du parc.', 'The Martin family lives near the park.', 'fah-MEE', 'une'),
      t('mere', 'mother', 'family', 'Ma mere travaille aujourd hui.', 'My mother works today.', 'mehr', 'une'),
      t('pere', 'father', 'family', 'Son pere prend le bus.', 'His/her father takes the bus.', 'pehr', 'un'),
      t('frere', 'brother', 'family', 'Mon frere a un livre bleu.', 'My brother has a blue book.', 'frehr', 'un'),
      t('soeur', 'sister', 'family', 'Sa soeur est contente.', 'His/her sister is happy.', 'suhr', 'une'),
      t('parents', 'parents', 'family', 'Mes parents sont a la maison.', 'My parents are at home.'),
      t('enfant', 'child', 'family', "L'enfant a une petite chaise.", 'The child has a small chair.', 'ahn-FAHN', 'un'),
      t('fille', 'girl / daughter', 'family', 'La fille de Madame Dupont est etudiante.', "Madame Dupont's daughter is a student.", 'fee', 'une'),
      t('fils', 'son', 'family', 'Son fils a un cahier vert.', 'His/her son has a green notebook.', 'fees', 'un'),
      t('ami / amie', 'friend', 'people', 'Mon amie Samira parle avec Alex.', 'My friend Samira speaks with Alex.'),
      t('voisin / voisine', 'neighbor', 'people', 'Marc est mon voisin.', 'Marc is my neighbor.'),
      t('maison', 'house / home', 'home', 'Notre maison est pres du cafe.', 'Our house is near the cafe.', 'may-ZOHN', 'une'),
      t('appartement', 'apartment', 'home', "L'appartement d'Alex est petit.", "Alex's apartment is small.", 'ah-par-tuh-MAHN', 'un'),
      t('ensemble', 'together', 'connection', 'Nous revisons ensemble le dimanche.', 'We review together on Sunday.'),
      t('gentil / gentille', 'kind', 'description', 'Madame Dupont est gentille.', 'Madame Dupont is kind.'),
      t('age / agee', 'older / aged', 'description', 'Son pere est age mais actif.', 'His father is older but active.'),
      t('jeune', 'young', 'description', 'Sa soeur est jeune.', 'His/her sister is young.'),
      t('connaitre', 'to know a person', 'verbs', 'Samira connait ma famille.', 'Samira knows my family.'),
      t('presenter', 'to introduce', 'verbs', 'Alex presente sa famille.', 'Alex introduces his family.')
    ]
  },
  6: {
    title: 'Je voudrais du cafe',
    main: 'partitives and polite requests',
    review: 'possessives and articles in cafe sentences',
    newLabel: 'food, drinks, and cafe requests',
    goal: 'order food politely and describe food preferences with du, de la, de l, des, and pas de.',
    grammarRows: [
      ['du', 'some before masculine singular', 'du pain'],
      ['de la', 'some before feminine singular', 'de la soupe'],
      ["de l'", 'some before vowel sound', "de l'eau"],
      ['des', 'some plural', 'des pommes'],
      ['pas de', 'not any after negation', "Je ne veux pas de cafe."]
    ],
    watch: 'After a negative, use pas de: Je voudrais du cafe, but Je ne veux pas de cafe.',
    reading: "Au cafe, Samira commande avec Alex. Elle dit : Je voudrais de l'eau et une salade, s'il vous plait. Alex prend du pain, de la soupe et un cafe. Marc ne veut pas de dessert parce qu'il n'a pas tres faim. Madame Dupont demande : Est-ce que votre table est propre ? Alex repond : Oui, notre table est propre et la chaise est confortable.",
    readingEnglish: 'At the cafe, the characters order food politely while reviewing possessives and adjectives.',
    listening: "Madame Dupont dit : Bonjour, vous voulez quoi ? Alex repond : Je voudrais du cafe et du pain. Samira dit : Pour moi, de l'eau et une salade, s'il vous plait.",
    writingTest: 'Write a short cafe order of 8 sentences. Include one polite request, three partitives, one negative with pas de, and one review sentence with a possessive.',
    model: "Bonjour Madame Dupont. Je voudrais du cafe, s'il vous plait. Je voudrais aussi de la soupe et du pain. Samira prend de l'eau. Marc ne veut pas de dessert. Notre table est propre. Mon sac est sous la chaise. Merci et au revoir.",
    vocab: [
      t('je voudrais', 'I would like', 'polite request', 'Je voudrais du cafe, s il vous plait.', 'I would like some coffee, please.'),
      t('du', 'some masculine', 'partitives', 'Alex prend du pain.', 'Alex takes some bread.'),
      t('de la', 'some feminine', 'partitives', 'Samira prend de la soupe.', 'Samira has some soup.'),
      t("de l'", 'some before vowel', 'partitives', "Je voudrais de l'eau.", 'I would like some water.'),
      t('pas de', 'not any', 'partitives', 'Marc ne veut pas de dessert.', 'Marc does not want any dessert.'),
      t('cafe', 'coffee / cafe', 'food', 'Je voudrais un cafe chaud.', 'I would like a hot coffee.', 'kah-FAY', 'un'),
      t('eau', 'water', 'drink', "Samira boit de l'eau.", 'Samira drinks water.', 'oh', 'une'),
      t('the', 'tea', 'drink', 'Madame Dupont prend du the.', 'Madame Dupont has tea.', 'tay', 'un'),
      t('lait', 'milk', 'drink', 'Je ne veux pas de lait.', 'I do not want milk.', 'leh', 'un'),
      t('pain', 'bread', 'food', 'Alex mange du pain.', 'Alex eats bread.', 'pan', 'un'),
      t('soupe', 'soup', 'food', 'La soupe est chaude.', 'The soup is hot.', 'soop', 'une'),
      t('salade', 'salad', 'food', 'Je voudrais une salade verte.', 'I would like a green salad.', 'sah-LAHD', 'une'),
      t('sandwich', 'sandwich', 'food', 'Marc prend un sandwich.', 'Marc has a sandwich.', 'sahn-DWEESH', 'un'),
      t('pomme', 'apple', 'food', 'Samira a une pomme rouge.', 'Samira has a red apple.', 'pohm', 'une'),
      t('fromage', 'cheese', 'food', 'Je voudrais du fromage.', 'I would like some cheese.', 'fro-MAHZH', 'un'),
      t('dessert', 'dessert', 'food', 'Marc ne veut pas de dessert.', 'Marc does not want dessert.', 'deh-SEHR', 'un'),
      t('menu', 'menu', 'restaurant', 'Le menu est sur la table.', 'The menu is on the table.', 'muh-NUU', 'un'),
      t('serveur / serveuse', 'server', 'restaurant', 'La serveuse est gentille.', 'The server is kind.'),
      t('addition', 'bill', 'restaurant', "L'addition est sur la table.", 'The bill is on the table.', 'ah-dee-SYOHN', 'une'),
      t('table', 'table', 'restaurant', 'Notre table est propre.', 'Our table is clean.', 'TAHBL', 'une'),
      t('chaud / chaude', 'hot / warm', 'description', 'Le cafe est chaud.', 'The coffee is hot.'),
      t('froid / froide', 'cold', 'description', "L'eau est froide.", 'The water is cold.'),
      t('sucre', 'sugar', 'food', 'Je prends du sucre avec le cafe.', 'I take sugar with coffee.', 'SUUKR', 'un'),
      t('sel', 'salt', 'food', 'Il y a du sel sur la table.', 'There is salt on the table.', 'sehl', 'un'),
      t('assiette', 'plate', 'restaurant', "L'assiette est blanche.", 'The plate is white.', 'ah-SYEHT', 'une'),
      t('verre', 'glass', 'restaurant', 'Le verre est propre.', 'The glass is clean.', 'vehr', 'un'),
      t('tasse', 'cup', 'restaurant', 'La tasse est petite.', 'The cup is small.', 'tahs', 'une'),
      t('avoir faim', 'to be hungry', 'food', "J'ai faim a midi.", 'I am hungry at noon.'),
      t('avoir soif', 'to be thirsty', 'food', "J'ai soif apres la classe.", 'I am thirsty after class.'),
      t('commander', 'to order', 'restaurant', 'Nous commandons au cafe.', 'We order at the cafe.')
    ]
  },
  7: {
    title: 'Vous voulez une chemise bleue ?',
    main: 'question forms with vouloir and prendre',
    review: 'numbers, articles, adjectives, and partitives',
    newLabel: 'shopping, clothes, prices, and quantities',
    goal: 'ask and answer simple shopping questions about what someone wants, takes, and pays.',
    grammarRows: [
      ['Est-ce que', 'neutral yes/no question', 'Est-ce que vous voulez une chemise ?'],
      ['Qu est-ce que', 'what question', 'Qu est-ce que tu prends ?'],
      ['Ou', 'where question', 'Ou est le magasin ?'],
      ['Combien', 'how much / how many', 'Combien coute le manteau ?'],
      ['vouloir / prendre', 'want / take in the present', 'Je veux une robe. Je prends un sac.']
    ],
    watch: 'Keep the question frame stable first. Est-ce que + sentence is the safest beginner pattern.',
    reading: "Samira et Alex vont au magasin pres du cafe. Samira cherche une chemise bleue pour sa soeur. Alex regarde un manteau noir, mais il est trop cher. Marc demande : Combien coute le sac rouge ? La vendeuse repond : Il coute dix dollars. Alex prend le sac parce qu'il est utile pour la classe. Ensuite, ils prennent de l'eau au cafe et revisent les questions.",
    readingEnglish: 'The group shops for clothes and practices question forms with prices.',
    listening: "La vendeuse dit : Bonjour, vous voulez quoi ? Samira repond : Je veux une chemise bleue. Alex demande : Combien coute ce sac ? La vendeuse dit : Il coute dix dollars.",
    writingTest: 'Write a 10-line shopping dialogue. Use est-ce que, qu est-ce que, combien, vouloir, prendre, one color, and one price.',
    model: "Bonjour, vous voulez quoi ? Je veux une chemise bleue, s'il vous plait. Quelle taille ? Petite. Combien coute la chemise ? Elle coute dix dollars. Est-ce que vous prenez aussi un sac ? Oui, je prends un sac noir. Merci. Au revoir.",
    vocab: [
      t('est-ce que', 'question marker', 'questions', 'Est-ce que vous voulez une chemise ?', 'Do you want a shirt?'),
      t('qu est-ce que', 'what', 'questions', 'Qu est-ce que tu prends ?', 'What are you taking?'),
      t('combien', 'how much / how many', 'questions', 'Combien coute le sac ?', 'How much does the bag cost?'),
      t('ou', 'where', 'questions', 'Ou est le magasin ?', 'Where is the store?'),
      t('quand', 'when', 'questions', 'Quand est-ce que tu vas au magasin ?', 'When do you go to the store?'),
      t('pourquoi', 'why', 'questions', 'Pourquoi est-ce que tu prends le bus ?', 'Why do you take the bus?'),
      t('comment', 'how', 'questions', 'Comment est la chemise ?', 'What is the shirt like?'),
      t('je veux', 'I want', 'verbs', 'Je veux une robe rouge.', 'I want a red dress.'),
      t('vous voulez', 'you want', 'verbs', 'Vous voulez un cafe ?', 'Do you want a coffee?'),
      t('je prends', 'I take', 'verbs', 'Je prends le sac noir.', 'I take the black bag.'),
      t('vous prenez', 'you take', 'verbs', 'Vous prenez la chemise bleue ?', 'Are you taking the blue shirt?'),
      t('magasin', 'store', 'shopping', 'Le magasin est pres du cafe.', 'The store is near the cafe.', 'mah-gah-ZAN', 'un'),
      t('vendeur / vendeuse', 'salesperson', 'shopping', 'La vendeuse est gentille.', 'The salesperson is kind.'),
      t('chemise', 'shirt', 'clothes', 'Samira veut une chemise bleue.', 'Samira wants a blue shirt.', 'shuh-MEEZ', 'une'),
      t('robe', 'dress', 'clothes', 'La robe rouge est jolie.', 'The red dress is pretty.', 'rohb', 'une'),
      t('manteau', 'coat', 'clothes', 'Le manteau noir est cher.', 'The black coat is expensive.', 'mahn-TOH', 'un'),
      t('pantalon', 'pants', 'clothes', 'Le pantalon est trop grand.', 'The pants are too big.', 'pahn-tah-LOHN', 'un'),
      t('chaussures', 'shoes', 'clothes', 'Les chaussures sont noires.', 'The shoes are black.'),
      t('prix', 'price', 'shopping', 'Le prix est correct.', 'The price is correct.', 'pree', 'un'),
      t('dollar', 'dollar', 'shopping', 'Le sac coute dix dollars.', 'The bag costs ten dollars.', 'doh-LAHR', 'un'),
      t('cher / chere', 'expensive', 'shopping', 'Le manteau est trop cher.', 'The coat is too expensive.'),
      t('pas cher', 'inexpensive', 'shopping', 'Ce cahier n est pas cher.', 'This notebook is inexpensive.'),
      t('taille', 'size', 'shopping', 'Quelle taille voulez-vous ?', 'What size do you want?', 'tahy', 'une'),
      t('petit sac', 'small bag', 'shopping', 'Je prends un petit sac.', 'I take a small bag.'),
      t('grand manteau', 'big coat', 'shopping', 'Marc regarde un grand manteau.', 'Marc looks at a big coat.'),
      t('quantite', 'quantity', 'shopping', 'Quelle quantite voulez-vous ?', 'What quantity do you want?', 'kahn-tee-TAY', 'une'),
      t('un kilo', 'one kilogram', 'shopping', 'Je prends un kilo de pommes.', 'I take one kilogram of apples.'),
      t('beaucoup de', 'a lot of', 'quantity', 'Il y a beaucoup de livres.', 'There are many books.'),
      t('peu de', 'few / little', 'quantity', 'Il y a peu de chaises.', 'There are few chairs.'),
      t('acheter', 'to buy', 'shopping', 'Alex achete un sac pour la classe.', 'Alex buys a bag for class.')
    ]
  },
  8: {
    title: 'Il y a une banque a gauche',
    main: 'il y a and prepositions of place',
    review: 'question forms and shopping language',
    newLabel: 'transport, town places, and directions',
    goal: 'ask for and give a simple route through the neighborhood using place words.',
    grammarRows: [
      ['il y a', 'there is / there are', 'Il y a une banque a gauche.'],
      ['a gauche / a droite', 'on the left / on the right', 'Le cafe est a droite.'],
      ['pres de / loin de', 'near / far from', 'La gare est pres du parc.'],
      ['devant / derriere', 'in front of / behind', 'Le bus est devant la station.'],
      ['pour aller a', 'to go to', 'Pour aller au cafe, tournez a gauche.']
    ],
    watch: 'Use a with places after aller: aller au cafe, aller a la banque, aller a l ecole.',
    reading: "Alex cherche la banque dans le quartier. Samira explique : Il y a une banque a gauche de la pharmacie et un cafe a droite du parc. Pour aller a la banque, prends le bus jusqu'a la station, marche tout droit, puis tourne a gauche. Marc attend devant la boulangerie avec un petit sac. Apres, ils vont au cafe pour prendre de l'eau et reviser les questions.",
    readingEnglish: 'Samira gives Alex directions in the neighborhood while older shopping and cafe language returns.',
    listening: "Samira dit : Pour aller a la gare, marche tout droit. La gare est pres du parc. Il y a une pharmacie a droite et une banque a gauche. Alex repond : Merci, je prends le bus.",
    writingTest: 'Write 8 sentences explaining a simple route from the bus stop to a cafe, bank, school, or park. Use il y a, two place words, and one question.',
    model: "Ou est le cafe ? Il y a un cafe pres du parc. Pour aller au cafe, prends le bus jusqu'a la station. Marche tout droit. Tourne a droite devant la banque. La pharmacie est a gauche. Le cafe est a cote de la boulangerie. Je prends de l'eau au cafe.",
    vocab: [
      t('il y a', 'there is / there are', 'place', 'Il y a une banque pres du cafe.', 'There is a bank near the cafe.'),
      t('a gauche', 'on the left', 'directions', 'La banque est a gauche.', 'The bank is on the left.'),
      t('a droite', 'on the right', 'directions', 'Le cafe est a droite.', 'The cafe is on the right.'),
      t('tout droit', 'straight ahead', 'directions', 'Marche tout droit jusqu au parc.', 'Walk straight ahead to the park.'),
      t('tourner', 'to turn', 'directions', 'Tourne a gauche devant la banque.', 'Turn left in front of the bank.'),
      t('marcher', 'to walk', 'directions', 'Alex marche au parc.', 'Alex walks to the park.'),
      t('prendre le bus', 'to take the bus', 'transport', 'Je prends le bus pour aller en classe.', 'I take the bus to go to class.'),
      t('metro', 'subway', 'transport', 'Le metro est pres de la gare.', 'The subway is near the station.', 'may-TROH', 'un'),
      t('station', 'station / stop', 'transport', 'La station est devant le parc.', 'The stop is in front of the park.', 'stah-SYOHN', 'une'),
      t('gare', 'train station', 'transport', 'La gare est loin du cafe.', 'The train station is far from the cafe.', 'gahr', 'une'),
      t('quartier', 'neighborhood', 'town', 'Le quartier est calme.', 'The neighborhood is calm.', 'kar-TYAY', 'un'),
      t('rue', 'street', 'town', 'La rue est longue.', 'The street is long.', 'roo', 'une'),
      t('parc', 'park', 'town', 'Marc attend au parc.', 'Marc waits at the park.', 'park', 'un'),
      t('banque', 'bank', 'town', 'La banque est a gauche.', 'The bank is on the left.', 'bahnk', 'une'),
      t('pharmacie', 'pharmacy', 'town', 'La pharmacie est pres de la banque.', 'The pharmacy is near the bank.', 'far-mah-SEE', 'une'),
      t('boulangerie', 'bakery', 'town', 'La boulangerie a du pain.', 'The bakery has bread.', 'boo-lahn-zhuh-REE', 'une'),
      t('ecole', 'school', 'town', "L'ecole est pres de la station.", 'The school is near the stop.', 'ay-KOHL', 'une'),
      t('bureau de poste', 'post office', 'town', 'Le bureau de poste est a droite.', 'The post office is on the right.', 'boo-ROH duh pohst', 'un'),
      t('loin de', 'far from', 'place', 'La gare est loin de ma maison.', 'The station is far from my house.'),
      t('pres de', 'near', 'place', 'Le cafe est pres du parc.', 'The cafe is near the park.'),
      t('entre', 'between', 'place', 'La banque est entre le cafe et la pharmacie.', 'The bank is between the cafe and the pharmacy.'),
      t('en face de', 'across from', 'place', "L'ecole est en face du parc.", 'The school is across from the park.'),
      t('jusqu a', 'until / as far as', 'directions', 'Marche jusqu a la station.', 'Walk as far as the stop.'),
      t('plan', 'map / plan', 'directions', 'Samira regarde le plan du quartier.', 'Samira looks at the neighborhood map.', 'plahn', 'un'),
      t('route', 'route', 'directions', 'La route est facile.', 'The route is easy.', 'root', 'une'),
      t('adresse', 'address', 'directions', "J'ai l'adresse du cafe.", 'I have the cafe address.', 'ah-DREHS', 'une'),
      t('attendre', 'to wait', 'verbs', 'Marc attend devant la boulangerie.', 'Marc waits in front of the bakery.'),
      t('arriver', 'to arrive', 'verbs', 'Alex arrive a la station.', 'Alex arrives at the stop.'),
      t('partir', 'to leave', 'verbs', 'Nous partons apres la classe.', 'We leave after class.'),
      t('demander le chemin', 'to ask directions', 'directions', 'Alex demande le chemin a Samira.', 'Alex asks Samira for directions.')
    ]
  },
  9: {
    title: 'Je me leve le matin',
    main: 'reflexive verbs for daily routine',
    review: 'place expressions and time from earlier weeks',
    newLabel: 'rooms, furniture, daily activities, and routine sequence',
    goal: 'describe a typical day with je me, tu te, il se, and elle se in controlled sentences.',
    grammarRows: [
      ['je me', 'I do the action to/for myself', 'Je me leve a sept heures.'],
      ['tu te', 'you do the action to/for yourself', 'Tu te prepares le matin.'],
      ['il / elle se', 'he/she does the action to/for self', 'Elle se couche le soir.'],
      ['nous nous', 'we do the action to/for ourselves', 'Nous nous preparons ensemble.'],
      ['routine order', 'time marker + reflexive verb + place', 'Le matin, je me lave dans la salle de bain.']
    ],
    watch: 'Keep the small reflexive word with the subject: je me, tu te, il se, elle se. Do not drop it.',
    reading: "Le matin, Alex se leve a sept heures dans son appartement. Il se lave dans la salle de bain, puis il se prepare dans sa chambre. Il prend du pain et de l'eau dans la cuisine. Ensuite, il prend le bus pour aller en classe. Samira se leve aussi tot, mais Marc se leve tard le samedi. Le soir, Alex revise le francais, parle avec sa famille, puis se couche a dix heures.",
    readingEnglish: 'Alex describes his routine using reflexive verbs with known rooms, food, transport, and family words.',
    listening: "Alex dit : Le matin, je me leve a sept heures. Je me lave, je me prepare, et je prends le bus. Le soir, je revise avec Samira et je me couche a dix heures.",
    writingTest: 'Write 10 sentences about a typical day. Use at least four reflexive verbs, three time markers, one room, one food item, and one place expression.',
    model: "Le matin, je me leve a sept heures. Je me lave dans la salle de bain. Je me prepare dans ma chambre. Je prends du pain dans la cuisine. Ensuite, je prends le bus pour aller en classe. A midi, je mange une salade au cafe. Le soir, je revise le francais. Je parle avec ma famille. Je me couche a dix heures. Ma journee est simple mais utile.",
    vocab: [
      t('je me leve', 'I get up', 'routine', 'Je me leve a sept heures.', 'I get up at seven o clock.'),
      t('tu te leves', 'you get up', 'routine', 'Tu te leves tot le lundi.', 'You get up early on Monday.'),
      t('il se leve / elle se leve', 'he/she gets up', 'routine', 'Elle se leve avant la classe.', 'She gets up before class.'),
      t('je me lave', 'I wash', 'routine', 'Je me lave dans la salle de bain.', 'I wash in the bathroom.'),
      t('je me prepare', 'I get ready', 'routine', 'Je me prepare dans ma chambre.', 'I get ready in my bedroom.'),
      t('je me couche', 'I go to bed', 'routine', 'Je me couche a dix heures.', 'I go to bed at ten o clock.'),
      t('se reveiller', 'to wake up', 'routine', 'Alex se reveille tot.', 'Alex wakes up early.'),
      t('s habiller', 'to get dressed', 'routine', "Samira s'habille le matin.", 'Samira gets dressed in the morning.'),
      t('se brosser les dents', 'to brush teeth', 'routine', 'Marc se brosse les dents.', 'Marc brushes his teeth.'),
      t('matin', 'morning', 'time', 'Le matin, je prends le bus.', 'In the morning, I take the bus.', 'mah-TAN', 'un'),
      t('midi', 'noon', 'time', 'A midi, je mange une salade.', 'At noon, I eat a salad.'),
      t('apres-midi', 'afternoon', 'time', "L'apres-midi, j'etudie.", 'In the afternoon, I study.'),
      t('soir', 'evening', 'time', 'Le soir, je revise.', 'In the evening, I review.', 'swahr', 'un'),
      t('tot', 'early', 'time', 'Samira se leve tot.', 'Samira gets up early.'),
      t('tard', 'late', 'time', 'Marc se couche tard.', 'Marc goes to bed late.'),
      t('toujours', 'always', 'frequency', 'Je prends toujours mon cahier.', 'I always take my notebook.'),
      t('souvent', 'often', 'frequency', 'Nous mangeons souvent au cafe.', 'We often eat at the cafe.'),
      t('parfois', 'sometimes', 'frequency', 'Parfois, il pleut le matin.', 'Sometimes, it rains in the morning.'),
      t('salle de bain', 'bathroom', 'rooms', 'La salle de bain est petite.', 'The bathroom is small.', 'sahl duh ban', 'une'),
      t('cuisine', 'kitchen', 'rooms', 'Je mange dans la cuisine.', 'I eat in the kitchen.', 'kwee-ZEEN', 'une'),
      t('chambre', 'bedroom', 'rooms', 'Je me prepare dans ma chambre.', 'I get ready in my bedroom.', 'SHAHMBR', 'une'),
      t('canape', 'sofa', 'furniture', 'Le canape est dans le salon.', 'The sofa is in the living room.', 'kah-nah-PAY', 'un'),
      t('armoire', 'wardrobe', 'furniture', "L'armoire est pres du lit.", 'The wardrobe is near the bed.', 'ar-MWAHR', 'une'),
      t('miroir', 'mirror', 'furniture', 'Le miroir est dans la salle de bain.', 'The mirror is in the bathroom.', 'mee-RWAHR', 'un'),
      t('serviette', 'towel', 'home', 'La serviette est propre.', 'The towel is clean.', 'sehr-VYEHT', 'une'),
      t('savon', 'soap', 'home', 'Il y a du savon dans la salle de bain.', 'There is soap in the bathroom.', 'sah-VOHN', 'un'),
      t('routine', 'routine', 'routine', 'Ma routine est simple.', 'My routine is simple.', 'roo-TEEN', 'une'),
      t('journee', 'day / daytime', 'time', 'Ma journee commence tot.', 'My day starts early.', 'zhoor-NAY', 'une'),
      t('commencer', 'to begin', 'verbs', 'La journee commence a sept heures.', 'The day begins at seven.'),
      t('finir', 'to finish', 'verbs', 'Je finis le travail le soir.', 'I finish work in the evening.')
    ]
  },
  10: {
    title: 'Il pleut aujourd hui',
    main: 'weather expressions and time markers',
    review: 'reflexive routine verbs',
    newLabel: 'weather, seasons, dates, and planning expressions',
    goal: 'describe weather, seasons, and weekly plans while reviewing daily routine.',
    grammarRows: [
      ['il fait + adjective', 'weather with faire', 'Il fait froid.'],
      ['il y a + noun', 'weather with there is/are', 'Il y a du vent.'],
      ['il pleut / il neige', 'it rains / it snows', 'Il pleut aujourd hui.'],
      ['quand', 'when connector', "Quand il pleut, je reste a la maison."],
      ['time markers', 'today, tomorrow, this week', "Aujourd'hui il fait beau, demain il pleut."]
    ],
    watch: 'Weather often uses il, not the real subject. Say il pleut, il neige, il fait froid.',
    reading: "Aujourd'hui, il pleut dans le quartier d'Alex. Le matin, il se leve tot, mais il prend son manteau noir parce qu'il fait froid. Samira veut aller au parc, mais quand il pleut, elle reste au cafe avec Madame Dupont. Demain, il fait beau, alors Alex marche au parc avec Marc. En hiver, Marc prend le bus; en ete, il marche jusqu'a la classe.",
    readingEnglish: 'The characters make simple plans based on weather while routine and transport vocabulary returns.',
    listening: "Madame Dupont dit : Aujourd'hui, il fait froid et il pleut. Alex repond : Je prends mon manteau et le bus. Demain, s'il fait beau, je marche au parc avec Samira.",
    writingTest: 'Write 9 sentences about this week. Include three weather expressions, two time markers, one routine sentence, and one plan depending on weather.',
    model: "Aujourd'hui, il pleut et il fait froid. Je me leve tot. Je prends mon manteau noir. A midi, je mange de la soupe au cafe. Demain, il fait beau. Je marche au parc avec Samira. En hiver, je prends souvent le bus. En ete, je marche plus. Ma semaine est simple.",
    vocab: [
      t('il pleut', 'it is raining', 'weather', "Aujourd'hui, il pleut.", 'Today, it is raining.'),
      t('il neige', 'it is snowing', 'weather', 'En hiver, il neige parfois.', 'In winter, it sometimes snows.'),
      t('il fait froid', 'it is cold', 'weather', 'Il fait froid le matin.', 'It is cold in the morning.'),
      t('il fait chaud', 'it is hot', 'weather', 'En ete, il fait chaud.', 'In summer, it is hot.'),
      t('il fait beau', 'the weather is nice', 'weather', "Aujourd'hui, il fait beau.", 'Today, the weather is nice.'),
      t('il y a du vent', 'it is windy', 'weather', 'Il y a du vent pres du parc.', 'It is windy near the park.'),
      t('soleil', 'sun', 'weather', 'Il y a du soleil dans la cuisine.', 'There is sun in the kitchen.', 'soh-LAY', 'un'),
      t('pluie', 'rain', 'weather', 'La pluie est forte ce matin.', 'The rain is strong this morning.', 'plwee', 'une'),
      t('neige', 'snow', 'weather', 'La neige est blanche.', 'The snow is white.', 'nehzh', 'une'),
      t('nuage', 'cloud', 'weather', 'Il y a un nuage gris.', 'There is a gray cloud.', 'nwahzh', 'un'),
      t('saison', 'season', 'time', "L'hiver est une saison froide.", 'Winter is a cold season.', 'seh-ZOHN', 'une'),
      t('printemps', 'spring', 'season', 'Au printemps, il fait doux.', 'In spring, it is mild.'),
      t('ete', 'summer', 'season', 'En ete, Marc marche au parc.', 'In summer, Marc walks to the park.'),
      t('automne', 'fall / autumn', 'season', "En automne, il y a du vent.", 'In autumn, it is windy.'),
      t('hiver', 'winter', 'season', 'En hiver, je prends le bus.', 'In winter, I take the bus.'),
      t("aujourd'hui", 'today', 'time', "Aujourd'hui, je revise.", 'Today, I review.'),
      t('demain', 'tomorrow', 'time', 'Demain, Samira travaille.', 'Tomorrow, Samira works.'),
      t('ce matin', 'this morning', 'time', 'Ce matin, il fait froid.', 'This morning, it is cold.'),
      t('ce soir', 'this evening', 'time', 'Ce soir, je me couche tot.', 'This evening, I go to bed early.'),
      t('cette semaine', 'this week', 'time', 'Cette semaine, je travaille beaucoup.', 'This week, I work a lot.'),
      t('quand', 'when', 'connector', 'Quand il pleut, je reste au cafe.', 'When it rains, I stay at the cafe.'),
      t('si', 'if', 'connector', "S'il fait beau, nous allons au parc.", 'If the weather is nice, we go to the park.'),
      t('rester', 'to stay', 'verbs', 'Samira reste a la maison.', 'Samira stays at home.'),
      t('sortir', 'to go out', 'verbs', 'Marc sort quand il fait beau.', 'Marc goes out when the weather is nice.'),
      t('manteau', 'coat', 'clothes', 'Je prends mon manteau noir.', 'I take my black coat.', 'mahn-TOH', 'un'),
      t('parapluie', 'umbrella', 'weather', "J'ai un parapluie dans mon sac.", 'I have an umbrella in my bag.', 'pah-rah-PLWEE', 'un'),
      t('botte', 'boot', 'clothes', 'Les bottes sont pres de la porte.', 'The boots are near the door.', 'boht', 'une'),
      t('doux / douce', 'mild / soft', 'weather', 'Au printemps, il fait doux.', 'In spring, it is mild.'),
      t('fort / forte', 'strong', 'weather', 'Le vent est fort.', 'The wind is strong.'),
      t('prevoir', 'to plan / forecast', 'verbs', 'Je prevois une sortie au parc.', 'I plan an outing to the park.')
    ]
  },
  11: {
    title: "Je travaille et j'etudie",
    main: 'regular present-tense consolidation',
    review: 'weather and time expressions',
    newLabel: 'jobs, workplace, study tasks, and present-tense verbs',
    goal: 'describe a work or study day using regular present-tense patterns with older routine and time language.',
    grammarRows: [
      ['-er verbs with je', 'drop -er, add -e', 'je travaille, je prepare'],
      ['-er verbs with nous', 'drop -er, add -ons', 'nous travaillons, nous preparons'],
      ['common -ir pattern', 'je finis / nous finissons', 'Je finis mon exercice.'],
      ['common -re pattern', 'je reponds / nous repondons', 'Je reponds au message.'],
      ['routine + work', 'time marker + present verb', "Le matin, j'arrive au bureau."]
    ],
    watch: 'This week consolidates present tense. Do not add past endings yet; that starts in Week 12.',
    reading: "Marc travaille dans un bureau au centre-ville. Le matin, il lit ses courriels et prepare un document. A midi, il prend une salade au cafe. Le soir, il etudie le francais avec Samira. Quand il fait froid, il revise chez lui. Son projet est difficile mais utile. Madame Dupont corrige les exercices et repond aux questions de la classe.",
    readingEnglish: 'Marc’s work and study day consolidates present-tense verbs with weather and routine review.',
    listening: "Marc dit : Je travaille au bureau le matin. Je prepare un document et je reponds aux courriels. Le soir, j'etudie avec Samira et je revise la lecon.",
    writingTest: 'Write 10 sentences about a work or study day. Use five present-tense verbs, two time markers, one weather expression, and one routine sentence.',
    model: "Le matin, je me leve a sept heures. Il fait froid, alors je prends le bus. Je travaille au bureau avec mon collegue. Je prepare un document. Je reponds aux courriels. A midi, je mange une salade. L'apres-midi, je finis un projet. Le soir, j'etudie le francais. Je revise la lecon avec Samira. Je me couche a dix heures.",
    vocab: [
      t('je travaille', 'I work', 'present tense', 'Je travaille au bureau.', 'I work at the office.'),
      t('tu travailles', 'you work', 'present tense', 'Tu travailles avec Marc.', 'You work with Marc.'),
      t('il travaille / elle travaille', 'he/she works', 'present tense', 'Elle travaille le matin.', 'She works in the morning.'),
      t('nous travaillons', 'we work', 'present tense', 'Nous travaillons ensemble.', 'We work together.'),
      t("j'etudie", 'I study', 'present tense', "J'etudie le francais le soir.", 'I study French in the evening.'),
      t('je prepare', 'I prepare', 'present tense', 'Je prepare un document.', 'I prepare a document.'),
      t('je revise', 'I review', 'present tense', 'Je revise la lecon.', 'I review the lesson.'),
      t('je finis', 'I finish', 'present tense', "Je finis l'exercice.", 'I finish the exercise.'),
      t('je reponds', 'I answer', 'present tense', 'Je reponds au message.', 'I answer the message.'),
      t('je lis', 'I read', 'present tense', 'Je lis un courriel.', 'I read an email.'),
      t("j'ecris", 'I write', 'present tense', "J'ecris une note.", 'I write a note.'),
      t('bureau', 'office / desk', 'work', 'Marc travaille dans un bureau.', 'Marc works in an office.', 'boo-ROH', 'un'),
      t('travail', 'work / job', 'work', 'Mon travail est utile.', 'My work is useful.', 'trah-VAI', 'un'),
      t('collegue', 'colleague', 'work', 'Mon collegue est gentil.', 'My colleague is kind.', 'koh-LEG', 'un / une'),
      t('patron / patronne', 'boss', 'work', 'La patronne repond au message.', 'The boss answers the message.'),
      t('client / cliente', 'client', 'work', 'Le client attend au bureau.', 'The client waits at the office.'),
      t('courriel', 'email', 'work', "J'ecris un courriel court.", 'I write a short email.', 'koo-RYEHL', 'un'),
      t('message', 'message', 'work', 'Samira repond au message.', 'Samira answers the message.', 'meh-SAHZH', 'un'),
      t('document', 'document', 'work', 'Le document est sur la table.', 'The document is on the table.', 'doh-kuu-MAHN', 'un'),
      t('reunion', 'meeting', 'work', 'La reunion commence a midi.', 'The meeting begins at noon.', 'ray-uu-NYOHN', 'une'),
      t('projet', 'project', 'work', 'Le projet est difficile mais utile.', 'The project is difficult but useful.', 'proh-ZHEH', 'un'),
      t('pause', 'break', 'work', 'Je prends une pause au cafe.', 'I take a break at the cafe.', 'pohz', 'une'),
      t('formation', 'training', 'study', 'La formation est utile.', 'The training is useful.', 'for-mah-SYOHN', 'une'),
      t('cours', 'course', 'study', 'Le cours de francais est le soir.', 'The French course is in the evening.', 'koor', 'un'),
      t('exercice', 'exercise', 'study', "L'exercice est assez facile.", 'The exercise is fairly easy.', 'eg-zehr-SEES', 'un'),
      t('lecon', 'lesson', 'study', 'Je revise la lecon.', 'I review the lesson.', 'luh-SOHN', 'une'),
      t('note', 'note / grade', 'study', "J'ecris une note courte.", 'I write a short note.', 'noht', 'une'),
      t('professeur', 'teacher', 'study', 'Le professeur corrige les exercices.', 'The teacher corrects the exercises.', 'proh-feh-SUHR', 'un'),
      t('utile', 'useful', 'description', 'Ce document est utile.', 'This document is useful.'),
      t('a temps plein', 'full-time', 'work', 'Marc travaille a temps plein.', 'Marc works full-time.')
    ]
  },
  12: {
    title: "Hier, j'ai travaille",
    main: 'passe compose introduction with avoir',
    review: 'present-tense anchors and cumulative daily-life language',
    newLabel: 'yesterday, travel, errands, and completed actions',
    goal: 'write a short past-tense diary using j ai plus a controlled set of past participles.',
    grammarRows: [
      ['avoir + past participle', 'basic past action frame', "J'ai travaille hier."],
      ['-er verbs', 'past participle often ends in -e', "J'ai parle, j'ai mange."],
      ['common irregular participles', 'memorize as chunks', "J'ai pris, j'ai fait, j'ai lu."],
      ['time marker first', 'past time + past action', "Hier, j'ai pris le bus."],
      ['present anchor', 'today vs yesterday contrast', "Aujourd'hui je travaille; hier, j'ai travaille."]
    ],
    watch: 'Week 12 is recognition and controlled production only. Keep to avoir plus a small set of familiar past participles.',
    reading: "Hier, Alex a ecrit dans son journal. Le matin, il a pris le bus. Il a travaille au bureau, puis il a mange une salade au cafe avec Samira. L'apres-midi, il a etudie le francais et il a lu une lecon courte. Le soir, il a parle avec sa famille et il a prepare son sac pour aujourd'hui.",
    readingEnglish: 'Alex writes a controlled diary about yesterday using avoir plus past participles and old daily-life vocabulary.',
    listening: "Alex dit : Hier, j'ai pris le bus. J'ai travaille au bureau. A midi, j'ai mange une salade au cafe. Le soir, j'ai etudie avec Samira et j'ai ecrit dans mon journal.",
    writingTest: 'Write a 10-12 sentence diary about yesterday. Use hier, at least six j ai chunks, one food item, one place, one family or friend detail, and one today/yesterday contrast.',
    model: "Hier, j'ai pris le bus. J'ai travaille au bureau. A midi, j'ai mange une salade au cafe. J'ai bu de l'eau. L'apres-midi, j'ai etudie le francais. J'ai lu une lecon courte. J'ai ecrit une note dans mon journal. Le soir, j'ai parle avec ma famille. J'ai prepare mon sac. Aujourd'hui, je revise les memes mots.",
    vocab: [
      t("j'ai parle", 'I spoke', 'past', "Hier, j'ai parle avec Samira.", 'Yesterday, I spoke with Samira.'),
      t("tu as parle", 'you spoke', 'past', 'Tu as parle avec Madame Dupont.', 'You spoke with Madame Dupont.'),
      t('il a parle / elle a parle', 'he/she spoke', 'past', 'Elle a parle avec Marc.', 'She spoke with Marc.'),
      t('nous avons parle', 'we spoke', 'past', 'Nous avons parle au cafe.', 'We spoke at the cafe.'),
      t("j'ai travaille", 'I worked', 'past', "Hier, j'ai travaille au bureau.", 'Yesterday, I worked at the office.'),
      t("j'ai etudie", 'I studied', 'past', "Le soir, j'ai etudie le francais.", 'In the evening, I studied French.'),
      t("j'ai mange", 'I ate', 'past', "A midi, j'ai mange une salade.", 'At noon, I ate a salad.'),
      t("j'ai bu", 'I drank', 'past', "J'ai bu de l'eau au cafe.", 'I drank water at the cafe.'),
      t("j'ai pris", 'I took', 'past', "J'ai pris le bus le matin.", 'I took the bus in the morning.'),
      t("j'ai ecrit", 'I wrote', 'past', "J'ai ecrit une note courte.", 'I wrote a short note.'),
      t("j'ai lu", 'I read', 'past', "J'ai lu une lecon facile.", 'I read an easy lesson.'),
      t("j'ai vu", 'I saw', 'past', "J'ai vu Marc devant le cafe.", 'I saw Marc in front of the cafe.'),
      t("j'ai fait", 'I did / made', 'past', "J'ai fait un exercice.", 'I did an exercise.'),
      t("j'ai eu", 'I had', 'past', "J'ai eu une journee occupee.", 'I had a busy day.'),
      t('hier', 'yesterday', 'past time', "Hier, j'ai travaille.", 'Yesterday, I worked.'),
      t('avant-hier', 'the day before yesterday', 'past time', "Avant-hier, j'ai pris le bus.", 'The day before yesterday, I took the bus.'),
      t('la semaine derniere', 'last week', 'past time', "La semaine derniere, j'ai etudie.", 'Last week, I studied.'),
      t('le mois dernier', 'last month', 'past time', "Le mois dernier, j'ai visite le musee.", 'Last month, I visited the museum.'),
      t('deja', 'already', 'past time', "J'ai deja lu la lecon.", 'I already read the lesson.'),
      t('journal', 'diary / newspaper', 'writing', "J'ai ecrit dans mon journal.", 'I wrote in my diary.', 'zhoor-NAHL', 'un'),
      t('voyage', 'trip', 'travel', "J'ai raconte un petit voyage.", 'I told about a short trip.', 'vwah-YAHZH', 'un'),
      t('trajet', 'journey / commute', 'travel', "J'ai raconte mon trajet en bus.", 'I told about my bus commute.', 'trah-ZHEH', 'un'),
      t('billet', 'ticket', 'travel', "J'ai pris un billet a la gare.", 'I took a ticket at the station.', 'bee-YEH', 'un'),
      t('valise', 'suitcase', 'travel', "J'ai prepare ma valise.", 'I prepared my suitcase.', 'vah-LEEZ', 'une'),
      t('hotel', 'hotel', 'travel', "J'ai vu un hotel pres de la gare.", 'I saw a hotel near the station.', 'oh-TEL', 'un'),
      t('gare', 'train station', 'travel', "J'ai attendu a la gare.", 'I waited at the station.', 'gahr', 'une'),
      t('musee', 'museum', 'travel', "J'ai visite un musee avec Samira.", 'I visited a museum with Samira.', 'muu-ZAY', 'un'),
      t('photo', 'photo', 'travel', "J'ai vu une photo de ma famille.", 'I saw a photo of my family.', 'foh-TOH', 'une'),
      t('souvenir', 'memory / souvenir', 'travel', "J'ai achete un petit souvenir.", 'I bought a small souvenir.', 'soo-vuh-NEER', 'un'),
      t("d'abord", 'first', 'sequence', "D'abord, j'ai pris le bus.", 'First, I took the bus.'),
      t('ensuite', 'then', 'sequence', "Ensuite, j'ai travaille.", 'Then, I worked.'),
      t('apres', 'after', 'sequence', "Apres, j'ai mange au cafe.", 'After, I ate at the cafe.'),
      t('finalement', 'finally', 'sequence', "Finalement, j'ai ecrit dans mon journal.", 'Finally, I wrote in my diary.')
    ]
  },
  13: {
    title: "Avant, j'habitais pres du parc",
    main: 'imperfect introduction and contrast with passe compose',
    review: 'passe compose with avoir from Week 12',
    newLabel: 'childhood, habits, scene-setting words, and before/yesterday contrast',
    goal: 'understand and write short sentences that use the imperfect for background or habit and the passe compose for one finished event.',
    grammarRows: [
      ['avant', 'past background or habit', "Avant, j'habitais pres du parc."],
      ["j'etais", 'I was for description or state', "Quand j'etais enfant, j'etais timide."],
      ["j'avais", 'I had / used to have for age, things, or habits', "J'avais un petit cahier rouge."],
      ['je faisais', 'I used to do / was doing', "Le matin, je faisais un exercice."],
      ['je jouais', 'I used to play / was playing', "Apres la classe, je jouais au parc."],
      ['imparfait + passe compose', 'background plus one completed event', "Il pleuvait, puis j'ai pris le bus."]
    ],
    watch: "Use the imperfect for the scene, habit, or description: j'etais, j'avais, j'habitais. Use the passe compose for a finished event: j'ai pris, j'ai vu, j'ai ecrit.",
    reading: "Quand Alex etait enfant, il habitait pres du parc avec sa famille. Le matin, il se levait tot, il mangeait du pain avec de l'eau, et il prenait le bus avec sa mere. Il avait un petit sac noir et un cahier rouge pour la classe. Souvent, Samira jouait au parc apres la classe, et Marc regardait les photos de famille au cafe. Hier, Alex a vu une vieille photo dans son journal. Il pleuvait, alors il a pris le bus pour aller en classe avec Madame Dupont. En classe, il a ecrit trois phrases: avant, j'etais jeune; maintenant, j'etudie le francais; hier, j'ai raconte un souvenir.",
    readingEnglish: 'Alex compares childhood habits and background details with one completed event from yesterday, using familiar family, cafe, class, weather, and Week 12 past-tense language.',
    listening: "Samira dit : Quand j'etais enfant, j'habitais pres du cafe. Je jouais au parc avec Marc et je faisais un exercice le soir. Hier, j'ai vu une vieille photo, puis j'ai ecrit un petit souvenir dans mon journal.",
    writingTest: 'Write 10-12 short sentences comparing before and yesterday. Use at least four imperfect chunks, three passe compose chunks, two older review places or foods, and one weather sentence.',
    model: "Avant, j'etais enfant et j'habitais pres du parc. J'avais un petit sac bleu. Le matin, je me levais tot et je prenais le bus avec ma mere. Apres la classe, je jouais au parc avec Samira. Souvent, je mangeais du pain au cafe. Hier, j'ai vu une photo de famille. Il pleuvait, alors j'ai pris le bus. Ensuite, j'ai ecrit dans mon journal. Maintenant, j'etudie le francais en classe. Mon texte est court mais clair.",
    vocab: [
      t('avant', 'before / in the past', 'past contrast', "Avant, j'habitais pres du parc.", 'Before, I lived near the park.'),
      t('quand', 'when', 'past contrast', "Quand j'etais enfant, je jouais au parc.", 'When I was a child, I used to play at the park.'),
      t('enfant', 'child', 'childhood', "Quand j'etais enfant, j'avais un petit sac.", 'When I was a child, I had a small bag.', 'ahn-FAHN', 'un'),
      t('souvent', 'often', 'habit', "Souvent, je prenais le bus avec Samira.", 'Often, I used to take the bus with Samira.'),
      t('toujours', 'always / still', 'habit', "Avant, je revisais toujours le soir.", 'Before, I always reviewed in the evening.'),
      t('parfois', 'sometimes', 'habit', "Parfois, il pleuvait le matin.", 'Sometimes, it rained in the morning.'),
      t("j'etais", 'I was', 'imperfect etre', "Avant, j'etais timide en classe.", 'Before, I was shy in class.'),
      t('tu etais', 'you were', 'imperfect etre', "Tu etais content au cafe.", 'You were happy at the cafe.'),
      t('il etait / elle etait', 'he/she was', 'imperfect etre', "Elle etait calme avec Madame Dupont.", 'She was calm with Madame Dupont.'),
      t("j'avais", 'I had / used to have', 'imperfect avoir', "J'avais un cahier rouge.", 'I had a red notebook.'),
      t('tu avais', 'you had / used to have', 'imperfect avoir', "Tu avais une petite chambre.", 'You had a small bedroom.'),
      t('il avait / elle avait', 'he/she had / used to have', 'imperfect avoir', "Il avait un billet dans son sac.", 'He had a ticket in his bag.'),
      t("j'habitais", 'I lived / used to live', 'imperfect verbs', "J'habitais pres du parc.", 'I lived near the park.'),
      t('je jouais', 'I played / used to play', 'imperfect verbs', "Je jouais avec Marc apres la classe.", 'I used to play with Marc after class.'),
      t('je faisais', 'I did / used to do', 'imperfect verbs', "Je faisais un exercice le soir.", 'I used to do an exercise in the evening.'),
      t('je prenais', 'I took / used to take', 'imperfect verbs', "Je prenais le bus le matin.", 'I used to take the bus in the morning.'),
      t('je mangeais', 'I ate / used to eat', 'imperfect verbs', "Je mangeais du pain au cafe.", 'I used to eat bread at the cafe.'),
      t('je regardais', 'I watched / looked at', 'imperfect verbs', "Je regardais une photo de famille.", 'I looked at a family photo.'),
      t('vieille photo', 'old photo', 'memory', "Hier, j'ai vu une vieille photo.", 'Yesterday, I saw an old photo.'),
      t('souvenir', 'memory', 'memory', "J'ai raconte un souvenir en classe.", 'I told a memory in class.', 'soo-vuh-NEER', 'un'),
      t('timide', 'shy', 'description', "Avant, j'etais timide en classe.", 'Before, I was shy in class.'),
      t('calme', 'calm', 'description', "Samira etait calme au cafe.", 'Samira was calm at the cafe.'),
      t('bruyant / bruyante', 'noisy', 'description', "Le bus etait bruyant le matin.", 'The bus was noisy in the morning.'),
      t('pendant', 'during / for', 'time', "Pendant l'hiver, il faisait froid.", 'During winter, it was cold.'),
      t('alors', 'so / then', 'connector', "Il pleuvait, alors j'ai pris le bus.", 'It was raining, so I took the bus.'),
      t('puis', 'then', 'connector', "J'ai vu Samira, puis j'ai ecrit une note.", 'I saw Samira, then I wrote a note.'),
      t('maintenant', 'now', 'time contrast', "Maintenant, j'etudie le francais.", 'Now, I study French.'),
      t('il pleuvait', 'it was raining', 'imperfect weather', "Il pleuvait, alors j'ai pris le bus.", 'It was raining, so I took the bus.'),
      t('il faisait froid', 'it was cold', 'imperfect weather', "Avant, il faisait froid le matin.", 'Before, it was cold in the morning.'),
      t('il y avait', 'there was / there were', 'imperfect description', "Il y avait une petite table dans la cuisine.", 'There was a small table in the kitchen.')
    ]
  },
  14: {
    title: "J'ai mal a la tete",
    main: 'faut, devoir, and avoir mal a for health needs',
    review: 'past narration with passe compose and imperfect background',
    newLabel: 'body parts, symptoms, clinic actions, and simple health notes',
    goal: 'describe a simple health problem, say what is necessary, and write a short note using familiar past narration as support.',
    grammarRows: [
      ['il faut + infinitive', 'it is necessary to do something', 'Il faut boire de l eau.'],
      ['je dois + infinitive', 'I must / I have to', 'Je dois rester a la maison.'],
      ['vous devez + infinitive', 'you must / you have to', 'Vous devez appeler la clinique.'],
      ["j'ai mal a la / au / aux", 'I have pain in a body part', "J'ai mal a la tete."],
      ['avoir besoin de', 'to need something', "J'ai besoin de repos."],
      ['past narration + health action', 'what happened and what is needed now', "Hier, j'ai eu mal au ventre, alors je dois me reposer."]
    ],
    watch: "Use a la before feminine body parts, au before masculine body parts, and aux before plural body parts: a la tete, au dos, aux yeux. Keep advice chunks short: il faut boire, je dois appeler.",
    reading: "Hier matin, Alex etait fatigue. Il pleuvait et il faisait froid, alors il a pris le bus pour aller en classe. Au cafe, il a bu de l'eau, mais il avait mal a la tete et au ventre. Samira a dit : Il faut appeler la clinique. Madame Dupont a repondu : Vous devez vous reposer et boire de l'eau. A la clinique, la receptionniste a demande : Ou avez-vous mal ? Alex a dit : J'ai mal a la tete, au ventre et un peu au dos. Maintenant, Alex ecrit une note courte : Aujourd'hui, je dois rester a la maison. J'ai besoin de repos. Demain, je revise la lecon a la maison.",
    readingEnglish: 'Alex has a simple health problem after a cold rainy morning. The passage reviews imperfect background, completed past actions, cafe/class routines, and introduces clinic advice chunks.',
    listening: "Madame Dupont dit : Bonjour Alex, ou avez-vous mal ? Alex repond : J'ai mal a la tete et au dos. Hier, j'ai pris le bus sous la pluie. Madame Dupont dit : Il faut boire de l'eau et vous devez vous reposer aujourd'hui.",
    writingTest: 'Write a short health note of 8-10 sentences. Say where you have pain, what happened yesterday, what the weather was like, what you must do now, and one polite message to Madame Dupont or the clinic.',
    model: "Bonjour Madame Dupont. Aujourd'hui, je ne vais pas en classe. J'ai mal a la tete et au dos. Hier, il pleuvait et j'ai pris le bus. Apres la classe, j'ai eu mal au ventre. Maintenant, je dois rester a la maison. Il faut boire de l'eau et manger une soupe. J'ai besoin de repos. Je vais reviser la lecon demain. Merci.",
    vocab: [
      t('il faut', 'it is necessary / one must', 'necessity', "Il faut boire de l'eau.", 'It is necessary to drink water.'),
      t('je dois', 'I must / I have to', 'obligation', 'Je dois rester a la maison.', 'I must stay at home.'),
      t('vous devez', 'you must / you have to', 'obligation', 'Vous devez appeler la clinique.', 'You must call the clinic.'),
      t("j'ai besoin de", 'I need', 'need', "J'ai besoin de repos.", 'I need rest.'),
      t("j'ai mal a la tete", 'I have a headache', 'symptom', "Aujourd'hui, j'ai mal a la tete.", 'Today, I have a headache.'),
      t("j'ai mal au ventre", 'my stomach hurts', 'symptom', "Hier, j'ai eu mal au ventre.", 'Yesterday, my stomach hurt.'),
      t("j'ai mal au dos", 'my back hurts', 'symptom', "J'ai mal au dos apres le bus.", 'My back hurts after the bus.'),
      t("j'ai mal aux yeux", 'my eyes hurt', 'symptom', "J'ai mal aux yeux quand je lis longtemps.", 'My eyes hurt when I read for a long time.'),
      t('la tete', 'head', 'body', "J'ai mal a la tete.", 'My head hurts.', 'lah teht'),
      t('le ventre', 'stomach / belly', 'body', "Alex a mal au ventre.", "Alex's stomach hurts.", 'luh VAHN-truh'),
      t('le dos', 'back', 'body', 'Samira a mal au dos.', "Samira's back hurts.", 'luh doh'),
      t('les yeux', 'eyes', 'body', "J'ai mal aux yeux.", 'My eyes hurt.', 'layz yuh'),
      t('la gorge', 'throat', 'body', "J'ai mal a la gorge.", 'My throat hurts.', 'lah gorzh'),
      t('le bras', 'arm', 'body', 'Marc a mal au bras.', "Marc's arm hurts.", 'luh brah'),
      t('la jambe', 'leg', 'body', 'Madame Dupont a mal a la jambe.', "Madame Dupont's leg hurts.", 'lah zhahmb'),
      t('la main', 'hand', 'body', "J'ai mal a la main.", 'My hand hurts.', 'lah man'),
      t('la clinique', 'clinic', 'health place', 'Alex appelle la clinique.', 'Alex calls the clinic.', 'lah klee-NEEK'),
      t('le medecin', 'doctor', 'health person', 'Le medecin parle avec Alex.', 'The doctor speaks with Alex.', 'luh mayd-SAN'),
      t('la receptionniste', 'receptionist', 'health person', 'La receptionniste pose une question.', 'The receptionist asks a question.', 'lah ray-sehp-syoh-NEEST'),
      t('un rendez-vous', 'appointment', 'health action', "J'ai un rendez-vous a la clinique.", 'I have an appointment at the clinic.', 'uhn rahn-day-VOO'),
      t('appeler', 'to call', 'health action', 'Je dois appeler la clinique.', 'I must call the clinic.'),
      t('se reposer', 'to rest', 'health action', 'Il faut se reposer aujourd hui.', 'It is necessary to rest today.'),
      t('boire', 'to drink', 'health action', "Il faut boire de l'eau.", 'It is necessary to drink water.'),
      t('rester', 'to stay', 'health action', 'Je dois rester a la maison.', 'I must stay at home.'),
      t('prendre un medicament', 'to take medicine', 'health action', 'Je dois prendre un medicament.', 'I must take medicine.'),
      t('ca va mieux', 'it is going better', 'health status', 'Aujourd hui, ca va mieux.', 'Today, it is going better.'),
      t('fatigue / fatiguee', 'tired', 'symptom', 'Alex etait fatigue hier matin.', 'Alex was tired yesterday morning.'),
      t('malade', 'sick', 'symptom', "Marc est malade et il reste a la maison.", 'Marc is sick and stays at home.'),
      t('la note', 'note', 'writing', 'Alex ecrit une note courte.', 'Alex writes a short note.', 'lah noht'),
      t('desole / desolee', 'sorry', 'message', 'Desole, je ne vais pas en classe aujourd hui.', 'Sorry, I am not going to class today.')
    ]
  },
  15: {
    title: "Je pense que c'est utile",
    main: 'opinions and preferences',
    review: 'adjective agreement with health and daily-life details',
    newLabel: 'feelings, opinions, preferences, and simple reasons',
    goal: 'give a short opinion with a reason, using familiar people, places, health notes, and past narration.',
    grammarRows: [
      ['je pense que', 'I think that', "Je pense que la lecon est utile."],
      ["j'aime / je n'aime pas", 'I like / I do not like', "J'aime le cafe calme."],
      ['je prefere', 'I prefer', "Je prefere reviser le matin."],
      ['parce que', 'because', "Je reste a la maison parce que je suis fatigue."],
      ["c'est + adjective", 'it is + opinion adjective', "C'est important et facile."],
      ['opinion + review', 'opinion with older grammar', "Je prefere le bus parce qu'il pleuvait hier."]
    ],
    watch: "Keep opinions short. Use je pense que, j'aime, je prefere, and parce que before trying longer sentences.",
    reading: "En classe, Madame Dupont demande une opinion. Alex dit : Je pense que la lecon sur la sante est utile parce que je dois appeler la clinique parfois. Samira prefere les dialogues au cafe parce qu'ils sont clairs et calmes. Marc n'aime pas les longues phrases, mais il aime les exemples avec le bus, la famille et le parc. Hier, Alex avait mal a la tete, alors il a ecrit une note courte. Aujourd'hui, ca va mieux. Il pense que reviser un peu chaque jour est important. Avant, il etait timide; maintenant, il donne une petite opinion en francais.",
    readingEnglish: 'The class gives simple opinions about lessons and review topics while recycling health, past narration, adjectives, places, and routines.',
    listening: "Samira dit : Je prefere les petites lecons parce qu'elles sont claires. Alex repond : Moi, j'aime les dialogues a la clinique. Hier, j'avais mal a la tete, et maintenant je pense que les mots de sante sont utiles.",
    writingTest: 'Write an opinion paragraph of 8-10 short sentences. Say what you like, what you prefer, one thing you do not like, and why. Include one health sentence and one past narration sentence.',
    model: "Je pense que le francais est utile. J'aime les dialogues au cafe parce qu'ils sont clairs. Je prefere reviser le matin. Je n'aime pas les phrases trop longues. Hier, j'avais mal a la tete, alors j'ai ecrit une note courte. Maintenant, ca va mieux. Je pense que les mots de sante sont importants. Samira aime les exemples avec la famille. Marc prefere les histoires au parc.",
    vocab: [
      t('je pense que', 'I think that', 'opinion', 'Je pense que la lecon est utile.', 'I think the lesson is useful.'),
      t("j'aime", 'I like', 'preference', "J'aime le cafe calme.", 'I like the calm cafe.'),
      t("je n'aime pas", 'I do not like', 'preference', "Je n'aime pas les longues phrases.", 'I do not like long sentences.'),
      t('je prefere', 'I prefer', 'preference', 'Je prefere reviser le matin.', 'I prefer to review in the morning.'),
      t('parce que', 'because', 'connector', 'Je reste a la maison parce que je suis fatigue.', 'I stay at home because I am tired.'),
      t('a mon avis', 'in my opinion', 'opinion', 'A mon avis, la lecon est claire.', 'In my opinion, the lesson is clear.'),
      t("c'est utile", 'it is useful', 'opinion', "C'est utile pour la classe.", 'It is useful for class.'),
      t("c'est important", 'it is important', 'opinion', "C'est important de se reposer.", 'It is important to rest.'),
      t("c'est clair", 'it is clear', 'opinion', "C'est clair et facile.", 'It is clear and easy.'),
      t("c'est difficile", 'it is difficult', 'opinion', "C'est difficile mais utile.", 'It is difficult but useful.'),
      t('interessant / interessante', 'interesting', 'opinion adjective', "L'histoire est interessante.", 'The story is interesting.'),
      t('ennuyeux / ennuyeuse', 'boring', 'opinion adjective', "Le texte long est ennuyeux.", 'The long text is boring.'),
      t('agreable', 'pleasant', 'opinion adjective', 'Le parc est agreable.', 'The park is pleasant.'),
      t('stressant / stressante', 'stressful', 'opinion adjective', 'Le rendez-vous est stressant.', 'The appointment is stressful.'),
      t('content / contente', 'happy', 'feeling', 'Samira est contente en classe.', 'Samira is happy in class.'),
      t('inquiet / inquiete', 'worried', 'feeling', 'Alex est inquiet a la clinique.', 'Alex is worried at the clinic.'),
      t('triste', 'sad', 'feeling', 'Marc est triste parce qu il est malade.', 'Marc is sad because he is sick.'),
      t('calme', 'calm', 'feeling', 'Madame Dupont est calme.', 'Madame Dupont is calm.'),
      t('facile a comprendre', 'easy to understand', 'opinion', 'Le dialogue est facile a comprendre.', 'The dialogue is easy to understand.'),
      t('trop long / trop longue', 'too long', 'opinion', 'La phrase est trop longue.', 'The sentence is too long.'),
      t('meilleur / meilleure', 'better', 'comparison', 'Cette note est meilleure.', 'This note is better.'),
      t('plus utile', 'more useful', 'comparison', 'Le vocabulaire est plus utile maintenant.', 'The vocabulary is more useful now.'),
      t('moins difficile', 'less difficult', 'comparison', 'Le quiz est moins difficile apres la revision.', 'The quiz is less difficult after review.'),
      t('mon opinion', 'my opinion', 'writing', 'Mon opinion est courte.', 'My opinion is short.'),
      t('une raison', 'a reason', 'writing', 'Je donne une raison simple.', 'I give a simple reason.'),
      t('je suis d accord', 'I agree', 'interaction', 'Je suis d accord avec Samira.', 'I agree with Samira.'),
      t('je ne suis pas d accord', 'I disagree', 'interaction', 'Je ne suis pas d accord avec Marc.', 'I disagree with Marc.'),
      t('moi aussi', 'me too', 'interaction', "J'aime la lecon; moi aussi.", 'I like the lesson; me too.'),
      t('pas moi', 'not me', 'interaction', "Tu aimes le bus; pas moi.", 'You like the bus; not me.'),
      t('choisir', 'to choose', 'action', 'Je dois choisir une opinion.', 'I must choose an opinion.')
    ]
  },
  16: {
    title: "Je vais prendre rendez-vous",
    main: 'futur proche for plans',
    review: 'time expressions and opinions',
    newLabel: 'plans, goals, travel, appointments, and next-week time markers',
    goal: 'describe near-future plans with je vais, tu vas, il va, nous allons, and simple time markers.',
    grammarRows: [
      ['je vais + infinitive', 'I am going to', 'Je vais appeler la clinique.'],
      ['tu vas + infinitive', 'you are going to', 'Tu vas prendre le bus.'],
      ['il/elle va + infinitive', 'he/she is going to', 'Elle va reviser au cafe.'],
      ['nous allons + infinitive', 'we are going to', 'Nous allons etudier demain.'],
      ['time marker + future', 'when the plan happens', 'La semaine prochaine, je vais travailler.'],
      ['opinion + future', 'why the plan matters', "Je pense que je vais reviser parce que c'est utile."]
    ],
    watch: "Use aller in the present plus an infinitive: je vais appeler, elle va reviser. Do not add a second conjugated verb after vais.",
    reading: "La semaine prochaine, Alex va reprendre sa routine. Lundi, il va appeler la clinique pour confirmer un rendez-vous. Mardi, il va prendre le bus avec Samira et ils vont reviser au cafe. Alex pense que cette revision est utile parce qu'il a encore besoin de pratiquer le passe compose et l'imparfait. Mercredi, Marc va aller au parc si le temps est beau. Jeudi, Madame Dupont va donner un petit texte sur les opinions. Vendredi, Alex va ecrire un message court : Je vais etudier, je vais boire de l'eau, et je vais me reposer si j'ai mal a la tete.",
    readingEnglish: 'Alex plans the next week with appointments, class, cafe review, weather, health, and opinions.',
    listening: "Alex dit : Demain, je vais appeler la clinique. Ensuite, je vais prendre le bus et je vais etudier avec Samira au cafe. Samira repond : Nous allons reviser les opinions parce que c'est utile.",
    writingTest: 'Write 8-10 sentences about next week. Use at least five futur proche forms, three time markers, one opinion, and one health or appointment sentence.',
    model: "Demain, je vais etudier le francais. Lundi, je vais prendre le bus pour aller en classe. Mardi, je vais appeler la clinique. Mercredi, Samira va reviser avec moi au cafe. Nous allons lire un texte court. Je pense que cette routine est utile. Si j'ai mal a la tete, je vais me reposer. La semaine prochaine, je vais ecrire une note claire.",
    vocab: [
      t('je vais', 'I am going to', 'future', 'Je vais appeler la clinique.', 'I am going to call the clinic.'),
      t('tu vas', 'you are going to', 'future', 'Tu vas prendre le bus.', 'You are going to take the bus.'),
      t('il va / elle va', 'he/she is going to', 'future', 'Elle va reviser au cafe.', 'She is going to review at the cafe.'),
      t('nous allons', 'we are going to', 'future', 'Nous allons etudier demain.', 'We are going to study tomorrow.'),
      t('demain', 'tomorrow', 'future time', 'Demain, je vais rester a la maison.', 'Tomorrow, I am going to stay at home.'),
      t('la semaine prochaine', 'next week', 'future time', 'La semaine prochaine, je vais travailler.', 'Next week, I am going to work.'),
      t('lundi prochain', 'next Monday', 'future time', 'Lundi prochain, je vais en classe.', 'Next Monday, I am going to class.'),
      t('ce soir', 'this evening', 'future time', 'Ce soir, je vais reviser.', 'This evening, I am going to review.'),
      t('plus tard', 'later', 'future time', 'Plus tard, je vais ecrire une note.', 'Later, I am going to write a note.'),
      t('bientot', 'soon', 'future time', 'Bientot, ca va mieux.', 'Soon, it is going better.'),
      t('un projet', 'project / plan', 'plans', 'Alex a un petit projet.', 'Alex has a small project.'),
      t('un objectif', 'goal', 'plans', 'Mon objectif est clair.', 'My goal is clear.'),
      t('prendre rendez-vous', 'to make an appointment', 'appointment', 'Je vais prendre rendez-vous.', 'I am going to make an appointment.'),
      t('confirmer', 'to confirm', 'appointment', 'Je vais confirmer le rendez-vous.', 'I am going to confirm the appointment.'),
      t('annuler', 'to cancel', 'appointment', 'Je dois annuler le rendez-vous.', 'I must cancel the appointment.'),
      t('arriver', 'to arrive', 'travel', 'Je vais arriver a huit heures.', 'I am going to arrive at eight o clock.'),
      t('partir', 'to leave', 'travel', 'Nous allons partir apres la classe.', 'We are going to leave after class.'),
      t('revenir', 'to come back', 'travel', 'Marc va revenir au cafe.', 'Marc is going to come back to the cafe.'),
      t('continuer', 'to continue', 'study', 'Je vais continuer la lecon.', 'I am going to continue the lesson.'),
      t('pratiquer', 'to practice', 'study', 'Nous allons pratiquer les questions.', 'We are going to practice questions.'),
      t('reussir', 'to succeed', 'goal', 'Je veux reussir le quiz.', 'I want to succeed on the quiz.'),
      t('mon plan', 'my plan', 'plans', 'Mon plan est simple.', 'My plan is simple.'),
      t('mon horaire', 'my schedule', 'plans', 'Mon horaire est charge.', 'My schedule is busy.'),
      t('une date', 'a date', 'time', 'Je vais choisir une date.', 'I am going to choose a date.'),
      t('a huit heures', 'at eight o clock', 'time', 'Je vais partir a huit heures.', 'I am going to leave at eight o clock.'),
      t('avant la classe', 'before class', 'time', 'Je vais boire de l eau avant la classe.', 'I am going to drink water before class.'),
      t('apres le travail', 'after work', 'time', 'Je vais me reposer apres le travail.', 'I am going to rest after work.'),
      t('si possible', 'if possible', 'planning', 'Je vais venir si possible.', 'I am going to come if possible.'),
      t('peut-etre', 'maybe', 'planning', 'Peut-etre, je vais prendre le bus.', 'Maybe I am going to take the bus.'),
      t('certain / certaine', 'certain / sure', 'planning', 'Je suis certain de mon plan.', 'I am sure of my plan.')
    ]
  },
  17: {
    title: "Je voudrais prendre rendez-vous",
    main: 'conditional for politeness',
    review: 'future forms and appointment language',
    newLabel: 'polite requests, services, appointments, and helpful messages',
    goal: 'make polite requests by phone or message using je voudrais, pourriez-vous, and est-ce que je pourrais.',
    grammarRows: [
      ['je voudrais', 'I would like', 'Je voudrais prendre rendez-vous.'],
      ['pourriez-vous + infinitive', 'could you please', 'Pourriez-vous repeter, s il vous plait ?'],
      ['est-ce que je pourrais', 'could I', 'Est-ce que je pourrais changer le rendez-vous ?'],
      ["j'aimerais", 'I would like / I would love', "J'aimerais parler a la receptionniste."],
      ['polite reason', 'request plus why', "Je voudrais annuler parce que j'ai mal a la tete."],
      ['future review', 'request with next plan', 'Je voudrais venir demain si possible.']
    ],
    watch: "For now, memorize the polite chunks. Do not build every conditional form yet; use je voudrais, pourriez-vous, and je pourrais safely.",
    reading: "Alex appelle la clinique. Il dit : Bonjour, je voudrais prendre rendez-vous, s'il vous plait. La receptionniste repond : Bien sur. Pourriez-vous donner votre nom ? Alex donne son nom et explique : Hier, j'avais mal au dos et aujourd'hui j'ai encore mal a la tete. Est-ce que je pourrais venir demain matin ? La receptionniste propose huit heures. Alex pense que c'est utile parce qu'il va prendre le bus avant la classe. Il ecrit ensuite un message a Madame Dupont : Bonjour, je voudrais vous informer que j'ai un rendez-vous demain.",
    readingEnglish: 'Alex makes a polite clinic request, gives a reason, and sends a short message while reviewing future plans and health vocabulary.',
    listening: "La receptionniste dit : Clinique du quartier, bonjour. Alex repond : Bonjour, je voudrais prendre rendez-vous. Pourriez-vous repeter l'heure, s'il vous plait ? Est-ce que je pourrais venir demain ?",
    writingTest: 'Write a polite request message of 8-10 sentences or lines. Ask for an appointment or help, give one reason, include one future plan, and use at least three polite chunks.',
    model: "Bonjour Madame. Je voudrais prendre rendez-vous, s'il vous plait. J'ai mal au dos depuis hier. Pourriez-vous me donner une heure demain ? Est-ce que je pourrais venir le matin ? Je vais prendre le bus si possible. J'aimerais aussi confirmer l'adresse. Merci beaucoup. Bonne journee.",
    vocab: [
      t('je voudrais', 'I would like', 'polite request', 'Je voudrais prendre rendez-vous.', 'I would like to make an appointment.'),
      t('pourriez-vous', 'could you', 'polite request', 'Pourriez-vous repeter ?', 'Could you repeat?'),
      t('est-ce que je pourrais', 'could I', 'polite request', 'Est-ce que je pourrais venir demain ?', 'Could I come tomorrow?'),
      t("j'aimerais", 'I would like', 'polite request', "J'aimerais parler a la receptionniste.", 'I would like to speak to the receptionist.'),
      t('s il vous plait', 'please', 'politeness', 'Repetez, s il vous plait.', 'Repeat, please.'),
      t('merci beaucoup', 'thank you very much', 'politeness', 'Merci beaucoup pour votre aide.', 'Thank you very much for your help.'),
      t('bien sur', 'of course', 'politeness', 'Bien sur, je peux aider.', 'Of course, I can help.'),
      t('excusez-moi', 'excuse me', 'politeness', 'Excusez-moi, je suis en retard.', 'Excuse me, I am late.'),
      t('repeter', 'to repeat', 'service', 'Pourriez-vous repeter ?', 'Could you repeat?'),
      t('changer', 'to change', 'service', 'Je voudrais changer le rendez-vous.', 'I would like to change the appointment.'),
      t('confirmer', 'to confirm', 'service', 'Je voudrais confirmer l heure.', 'I would like to confirm the time.'),
      t('donner', 'to give', 'service', 'Pourriez-vous donner l adresse ?', 'Could you give the address?'),
      t('envoyer', 'to send', 'service', 'Je vais envoyer un message.', 'I am going to send a message.'),
      t('recevoir', 'to receive', 'service', 'Je voudrais recevoir une note.', 'I would like to receive a note.'),
      t('aider', 'to help', 'service', 'Pourriez-vous aider Alex ?', 'Could you help Alex?'),
      t('une aide', 'help', 'service', "J'ai besoin d'une aide courte.", 'I need brief help.'),
      t('un service', 'service / favor', 'service', 'Je voudrais un service.', 'I would like a service.'),
      t('une information', 'information', 'service', 'Je voudrais une information.', 'I would like information.'),
      t('une adresse', 'address', 'service', 'Pourriez-vous donner l adresse ?', 'Could you give the address?'),
      t('un numero', 'number', 'service', 'Je vais ecrire le numero.', 'I am going to write the number.'),
      t('une heure', 'time / hour', 'appointment', 'Je voudrais confirmer l heure.', 'I would like to confirm the time.'),
      t('demain matin', 'tomorrow morning', 'time', 'Je pourrais venir demain matin.', 'I could come tomorrow morning.'),
      t('demain apres-midi', 'tomorrow afternoon', 'time', 'Je voudrais venir demain apres-midi.', 'I would like to come tomorrow afternoon.'),
      t('si possible', 'if possible', 'politeness', 'Je voudrais venir si possible.', 'I would like to come if possible.'),
      t('bonne journee', 'have a good day', 'politeness', 'Merci et bonne journee.', 'Thank you and have a good day.'),
      t('je vous ecris', 'I am writing to you', 'message', 'Je vous ecris parce que je suis malade.', 'I am writing to you because I am sick.'),
      t('je vous appelle', 'I am calling you', 'message', 'Je vous appelle pour un rendez-vous.', 'I am calling you for an appointment.'),
      t('pour confirmer', 'to confirm', 'message', 'Je vous appelle pour confirmer.', 'I am calling to confirm.'),
      t('pour changer', 'to change', 'message', 'Je vous ecris pour changer le rendez-vous.', 'I am writing to change the appointment.'),
      t('pour demander', 'to ask for', 'message', 'Je vous ecris pour demander une aide.', 'I am writing to ask for help.')
    ]
  },
  18: {
    title: "Je le prends, je lui parle",
    main: 'direct and indirect pronouns, staged',
    review: 'present and past anchors',
    newLabel: 'high-frequency pronouns and support verbs in short dialogue chains',
    goal: 'recognize and use le, la, les, and lui in very controlled sentences with familiar objects and people.',
    grammarRows: [
      ['le', 'it / him for masculine direct object', 'Je prends le bus. Je le prends.'],
      ['la', 'it / her for feminine direct object', 'Je lis la note. Je la lis.'],
      ['les', 'them for plural direct objects', 'Je revise les mots. Je les revise.'],
      ['lui', 'to him / to her', 'Je parle a Samira. Je lui parle.'],
      ['pronoun before verb', 'where the pronoun goes', 'Je le prends demain.'],
      ['past with pronoun recognition', 'understand before producing freely', "Hier, je l'ai vu au cafe."]
    ],
    watch: "Put the pronoun before the verb: je le prends, je la lis, je lui parle. For Week 18, keep production short and controlled.",
    reading: "Au cafe, Samira aide Alex avec une note pour la clinique. Alex lit la note; il la lit lentement. Il regarde le numero; il le copie dans son cahier. Samira montre les mots importants; Alex les revise. Ensuite, il parle a Madame Dupont; il lui explique qu'il a mal au dos. Hier, il a pris le bus et il a vu Marc. Il lui a parle rapidement. Maintenant, Alex comprend mieux les petites chaines : je lis la note, je la lis; je parle a Samira, je lui parle.",
    readingEnglish: 'Alex practices short pronoun chains with a note, a number, important words, and familiar people while reviewing clinic and past narration language.',
    listening: "Madame Dupont dit : La note est courte. Alex repond : Oui, je la lis. Samira demande : Et le numero ? Alex dit : Je le copie. Marc est au cafe; je lui parle apres la classe.",
    writingTest: 'Rewrite 8 short sentences with pronouns. Use le, la, les, and lui. Then write 3 original sentences about a note, a bus, words, or Samira.',
    model: "Je lis la note. Je la lis. Je prends le bus. Je le prends. Je revise les mots. Je les revise. Je parle a Samira. Je lui parle. Hier, j'ai vu Marc au cafe. Je lui ai parle.",
    vocab: [
      t('le', 'it / him', 'direct pronoun', 'Je prends le bus. Je le prends.', 'I take the bus. I take it.'),
      t('la', 'it / her', 'direct pronoun', 'Je lis la note. Je la lis.', 'I read the note. I read it.'),
      t('les', 'them', 'direct pronoun', 'Je revise les mots. Je les revise.', 'I review the words. I review them.'),
      t('lui', 'to him / to her', 'indirect pronoun', 'Je parle a Samira. Je lui parle.', 'I speak to Samira. I speak to her.'),
      t('me', 'me / to me', 'pronoun', 'Madame Dupont me parle.', 'Madame Dupont speaks to me.'),
      t('te', 'you / to you', 'pronoun', 'Je te donne la note.', 'I give you the note.'),
      t('nous', 'us / to us', 'pronoun', 'Elle nous aide en classe.', 'She helps us in class.'),
      t('vous', 'you / to you', 'pronoun', 'Je vous appelle demain.', 'I call you tomorrow.'),
      t('copier', 'to copy', 'support verb', 'Je copie le numero. Je le copie.', 'I copy the number. I copy it.'),
      t('montrer', 'to show', 'support verb', 'Samira montre la note.', 'Samira shows the note.'),
      t('expliquer', 'to explain', 'support verb', 'Alex explique le probleme.', 'Alex explains the problem.'),
      t('demander', 'to ask', 'support verb', 'Je demande une information.', 'I ask for information.'),
      t('donner', 'to give', 'support verb', 'Madame Dupont donne un exercice.', 'Madame Dupont gives an exercise.'),
      t('aider', 'to help', 'support verb', 'Samira aide Alex.', 'Samira helps Alex.'),
      t('lire', 'to read', 'support verb', 'Je lis la note.', 'I read the note.'),
      t('prendre', 'to take', 'support verb', 'Je prends le bus.', 'I take the bus.'),
      t('voir', 'to see', 'support verb', 'Je vois Marc.', 'I see Marc.'),
      t('appeler', 'to call', 'support verb', 'Je l appelle demain.', 'I call him/her tomorrow.'),
      t('parler a', 'to speak to', 'indirect verb', 'Je parle a Samira.', 'I speak to Samira.'),
      t('repondre a', 'to answer / respond to', 'indirect verb', 'Je reponds a Madame Dupont.', 'I answer Madame Dupont.'),
      t('ecrire a', 'to write to', 'indirect verb', 'J ecris a la clinique.', 'I write to the clinic.'),
      t('telephoner a', 'to phone', 'indirect verb', 'Je telephone au medecin.', 'I phone the doctor.'),
      t('la chaine', 'chain', 'practice', 'La chaine est courte.', 'The chain is short.'),
      t('la phrase modele', 'model sentence', 'practice', 'La phrase modele est claire.', 'The model sentence is clear.'),
      t('remplacer', 'to replace', 'practice', 'Je remplace la note par la.', 'I replace the note with la.'),
      t('avant le verbe', 'before the verb', 'grammar', 'Le pronom est avant le verbe.', 'The pronoun is before the verb.'),
      t('apres la classe', 'after class', 'time', 'Je lui parle apres la classe.', 'I speak to him/her after class.'),
      t('rapidement', 'quickly', 'manner', 'Alex repond rapidement.', 'Alex answers quickly.'),
      t('lentement', 'slowly', 'manner', 'Je lis lentement.', 'I read slowly.'),
      t('mieux', 'better', 'manner', 'Alex comprend mieux.', 'Alex understands better.')
    ]
  },
  19: {
    title: "La note qui aide Alex",
    main: 'qui, que, and dont basics',
    review: 'adjective and noun linking',
    newLabel: 'descriptive detail, possession, and relative-clause connectors',
    goal: 'add one useful detail to a person, place, or object using qui, que, or dont in controlled sentences.',
    grammarRows: [
      ['qui', 'who / that as subject', 'La note qui aide Alex est courte.'],
      ['que', 'that / which as object', 'La note que je lis est claire.'],
      ['dont', 'whose / of which / that ... about', "Le rendez-vous dont je parle est demain."],
      ['noun + adjective + qui', 'linked description', 'Le petit cafe qui est pres du parc est calme.'],
      ['review pronoun contrast', 'relative word is not le/la/les', 'Je lis la note que Samira a ecrite.'],
      ['one detail only', 'keep clauses short', "Marc est un ami qui m'aide."]
    ],
    watch: "Use qui when the next verb needs a subject. Use que when the next part already has a subject. Treat dont as a recognition chunk for now.",
    reading: "Madame Dupont donne un texte qui est court mais utile. Le texte parle d'Alex, qui a un rendez-vous a la clinique. La note que Samira a ecrite est claire. Elle donne le numero que Alex doit appeler et l'adresse que Marc copie dans son cahier. Le medecin dont Alex parle travaille pres du parc. Alex aime les phrases qui sont simples parce qu'il peut les comprendre. Avant, les longues phrases etaient difficiles. Maintenant, il ecrit une description plus claire : Samira est une amie qui m'aide, et la clinique que j'appelle est pres du cafe.",
    readingEnglish: 'The passage adds short details to familiar people, notes, numbers, addresses, and places using qui, que, and recognition of dont.',
    listening: "Madame Dupont dit : Choisissez une phrase qui est claire. Alex lit : La note que Samira a ecrite est utile. Marc ajoute : Le cafe qui est pres du parc est calme.",
    writingTest: 'Write 8-10 sentences describing a person, place, object, and appointment. Use at least three sentences with qui, two with que, and one recognition sentence with dont.',
    model: "Samira est une amie qui m'aide. Le cafe qui est pres du parc est calme. La note que je lis est courte. Le numero que je copie est important. Le rendez-vous dont je parle est demain. Madame Dupont est une professeure qui explique bien. J'aime les phrases qui sont claires.",
    vocab: [
      t('qui', 'who / that', 'relative pronoun', 'La note qui aide Alex est courte.', 'The note that helps Alex is short.'),
      t('que', 'that / which', 'relative pronoun', 'La note que je lis est claire.', 'The note that I read is clear.'),
      t('dont', 'whose / of which / that about', 'relative pronoun', 'Le rendez-vous dont je parle est demain.', 'The appointment that I am talking about is tomorrow.'),
      t('qui est', 'that is / who is', 'relative chunk', 'Le cafe qui est pres du parc est calme.', 'The cafe that is near the park is calm.'),
      t('que je lis', 'that I read', 'relative chunk', 'La note que je lis est utile.', 'The note that I read is useful.'),
      t('que je prends', 'that I take', 'relative chunk', 'Le bus que je prends est en retard.', 'The bus that I take is late.'),
      t('dont je parle', 'that I talk about', 'relative chunk', 'La clinique dont je parle est pres du parc.', 'The clinic that I talk about is near the park.'),
      t('une personne', 'person', 'description', 'Samira est une personne calme.', 'Samira is a calm person.'),
      t('un endroit', 'place', 'description', 'Le cafe est un endroit agreable.', 'The cafe is a pleasant place.'),
      t('un objet', 'object', 'description', 'Le cahier est un objet utile.', 'The notebook is a useful object.'),
      t('un detail', 'detail', 'description', 'Je donne un detail simple.', 'I give a simple detail.'),
      t('decrire', 'to describe', 'description', 'Je vais decrire la clinique.', 'I am going to describe the clinic.'),
      t('ajouter', 'to add', 'writing', 'Je dois ajouter un detail.', 'I must add a detail.'),
      t('lier', 'to link', 'writing', 'Je lie deux idees.', 'I link two ideas.'),
      t('une idee', 'idea', 'writing', 'Mon idee est claire.', 'My idea is clear.'),
      t('une description', 'description', 'writing', 'La description est courte.', 'The description is short.'),
      t('precis / precise', 'precise', 'description', 'La phrase est precise.', 'The sentence is precise.'),
      t('utile pour', 'useful for', 'description', 'Cette note est utile pour Alex.', 'This note is useful for Alex.'),
      t('pres du parc', 'near the park', 'place review', 'La clinique qui est pres du parc est ouverte.', 'The clinic that is near the park is open.'),
      t('dans mon cahier', 'in my notebook', 'place review', 'Le numero que je copie est dans mon cahier.', 'The number that I copy is in my notebook.'),
      t('la personne qui', 'the person who', 'relative chunk', 'La personne qui aide Alex est Samira.', 'The person who helps Alex is Samira.'),
      t('le texte que', 'the text that', 'relative chunk', 'Le texte que je lis est court.', 'The text that I read is short.'),
      t('la chose dont', 'the thing that / whose', 'relative chunk', 'La chose dont je parle est importante.', 'The thing that I am talking about is important.'),
      t('ouvrir', 'to open', 'action', 'Je vais ouvrir le message.', 'I am going to open the message.'),
      t('fermer', 'to close', 'action', 'Je vais fermer le cahier.', 'I am going to close the notebook.'),
      t('garder', 'to keep', 'action', 'Je garde la note.', 'I keep the note.'),
      t('trouver', 'to find', 'action', 'Je trouve le numero.', 'I find the number.'),
      t('chercher', 'to look for', 'action', 'Je cherche l adresse.', 'I look for the address.'),
      t('important pour moi', 'important to me', 'opinion', 'Ce rendez-vous est important pour moi.', 'This appointment is important to me.'),
      t('simple a utiliser', 'simple to use', 'opinion', 'Cette phrase est simple a utiliser.', 'This sentence is simple to use.')
    ]
  },
  20: {
    title: "Bonjour du Quebec",
    main: 'Canadian French recognition focus',
    review: 'relative clauses and pronouns',
    newLabel: 'high-value Quebec and Canadian French recognition differences',
    goal: 'recognize common Canadian French words and compare them with standard forms without needing to produce everything.',
    grammarRows: [
      ['recognition, not production', 'understand common variants', 'char = voiture / bus in context'],
      ['standard vs Canadian', 'two ways to understand one idea', 'courriel = email'],
      ['question recognition', 'informal spoken pattern', 'Tu veux-tu un cafe ?'],
      ['pronoun review', 'object pronouns still work', 'Je le prends. Je lui parle.'],
      ['relative review', 'describe the expression', "C'est un mot que j'entends au Quebec."],
      ['compare with parce que', 'short comparison sentence', 'Je comprends courriel parce que je connais message.']
    ],
    watch: "Week 20 is mainly recognition. You do not need to use informal Canadian forms actively in writing yet; learn to notice them and map them to familiar French.",
    reading: "Madame Dupont apporte un court texte sur le francais au Canada. Elle explique que certains mots changent selon la region. Au Quebec, on peut voir le mot courriel pour un message electronique. On peut aussi entendre magasinage pour shopping. Alex lit une phrase qui dit : J'ai pris mon char pour aller a la clinique. Madame Dupont explique que char peut signifier voiture dans ce contexte. Samira compare les mots qu'elle connait deja : le cafe, le bus, la clinique, le rendez-vous. Marc aime cette lecon parce qu'elle montre des expressions qu'il peut reconnaitre quand il ecoute des personnes du Quebec.",
    readingEnglish: 'The class learns to recognize common Canadian French forms and compare them with familiar standard French words, while reviewing relative clauses and pronouns.',
    listening: "Madame Dupont dit : Au Canada, vous pouvez voir courriel pour email. Samira demande : Est-ce que magasinage veut dire shopping ? Madame Dupont repond : Oui. Alex dit : C'est un mot que je peux reconnaitre.",
    writingTest: 'Write 8-10 comparison sentences. Compare at least five Canadian French recognition words with standard or English meanings. Include one qui/que sentence and one pronoun review sentence.',
    model: "Courriel veut dire email. Magasinage veut dire shopping. Char peut vouloir dire voiture. Dejeuner peut etre different selon la region. Je pense que ces mots sont utiles. C'est une expression que je peux reconnaitre. Le mot que je prefere est courriel. Je le comprends parce que je connais message. Je vais les reviser demain.",
    vocab: [
      t('le francais canadien', 'Canadian French', 'Canadian French', 'Nous reconnaissons le francais canadien.', 'We recognize Canadian French.'),
      t('au Quebec', 'in Quebec', 'place', 'Au Quebec, on entend parfois des mots differents.', 'In Quebec, one sometimes hears different words.'),
      t('une region', 'region', 'place', 'Chaque region a des mots utiles.', 'Each region has useful words.'),
      t('standard', 'standard', 'comparison', 'Voici le mot standard.', 'Here is the standard word.'),
      t('une expression', 'expression', 'language', 'Cette expression est utile.', 'This expression is useful.'),
      t('reconnaitre', 'to recognize', 'language', 'Je peux reconnaitre ce mot.', 'I can recognize this word.'),
      t('comparer', 'to compare', 'language', 'Je compare deux expressions.', 'I compare two expressions.'),
      t('vouloir dire', 'to mean', 'language', 'Que veut dire ce mot ?', 'What does this word mean?'),
      t('entendre', 'to hear', 'listening', "J'entends un mot du Quebec.", 'I hear a word from Quebec.'),
      t('prononcer', 'to pronounce', 'listening', 'Je vais prononcer le mot lentement.', 'I am going to pronounce the word slowly.'),
      t('courriel', 'email', 'Canadian French', 'Je vais envoyer un courriel.', 'I am going to send an email.'),
      t('message electronique', 'email message', 'standard comparison', 'Un courriel est un message electronique.', 'A courriel is an email message.'),
      t('magasinage', 'shopping', 'Canadian French', 'Samira parle du magasinage.', 'Samira talks about shopping.'),
      t('faire du magasinage', 'to go shopping', 'Canadian French', 'Marc va faire du magasinage.', 'Marc is going shopping.'),
      t('char', 'car in Quebec usage', 'Canadian French', 'Le char est devant la clinique.', 'The car is in front of the clinic.'),
      t('voiture', 'car', 'standard comparison', 'La voiture est pres du parc.', 'The car is near the park.'),
      t('cellulaire', 'cell phone', 'Canadian French', 'Mon cellulaire est dans mon sac.', 'My cell phone is in my bag.'),
      t('telephone portable', 'mobile phone', 'standard comparison', 'Le telephone portable est utile.', 'The mobile phone is useful.'),
      t('dejeuner', 'breakfast or lunch depending on region', 'Canadian French', 'Le mot dejeuner change selon la region.', 'The word dejeuner changes depending on the region.'),
      t('diner', 'lunch or dinner depending on region', 'Canadian French', 'Le mot diner peut changer aussi.', 'The word diner can also change.'),
      t('souper', 'supper / evening meal', 'Canadian French', 'Le souper est le soir.', 'Supper is in the evening.'),
      t('depanneur', 'corner store', 'Canadian French', 'Le depanneur est pres du cafe.', 'The corner store is near the cafe.'),
      t('stationnement', 'parking', 'Canadian French', 'Il y a du stationnement pres de la clinique.', 'There is parking near the clinic.'),
      t('fin de semaine', 'weekend', 'Canadian French', 'La fin de semaine, je vais reviser.', 'On the weekend, I am going to review.'),
      t('presentement', 'currently', 'Canadian French recognition', 'Presentement, Alex est en classe.', 'Currently, Alex is in class.'),
      t('bienvenue', 'you are welcome', 'Canadian French recognition', 'Merci. Bienvenue.', 'Thank you. You are welcome.'),
      t('tu veux-tu', 'do you want informal Canadian pattern', 'spoken recognition', 'Tu veux-tu un cafe ?', 'Do you want a coffee?'),
      t('c est le fun', 'it is fun', 'spoken recognition', 'Cette lecon, c est le fun.', 'This lesson is fun.'),
      t('a tantot', 'see you later', 'spoken recognition', 'A tantot, Samira.', 'See you later, Samira.'),
      t('plate', 'boring / dull in Quebec usage', 'spoken recognition', 'Cette longue attente est plate.', 'This long wait is boring.')
    ]
  },
  21: {
    title: "Il faut que je revise",
    main: 'subjunctive awareness through common chunks',
    review: 'opinions and necessity',
    newLabel: 'necessity, emotion, doubt, and recommendation chunks',
    goal: 'recognize common il faut que and je suis content que chunks without free subjunctive production.',
    grammarRows: [
      ['il faut que + chunk', 'it is necessary that', 'Il faut que je revise.'],
      ['je veux que + chunk', 'I want someone to', 'Je veux que tu comprennes la note.'],
      ['je suis content que', 'I am happy that', 'Je suis content que la lecon soit courte.'],
      ['je ne pense pas que', 'I do not think that', 'Je ne pense pas que ce soit difficile.'],
      ['recommandation chunk', 'advice with known language', 'Madame Dupont recommande que je me repose.'],
      ['recognition first', 'understand before producing', 'Il faut que vous appeliez la clinique.']
    ],
    watch: 'Week 21 is awareness first. Memorize common chunks; do not try to create every subjunctive form yet.',
    reading: "Madame Dupont donne une recommandation a Alex. Elle dit : Il faut que tu revises un peu chaque jour. Alex comprend l'idee parce qu'il connait deja il faut et je dois. Samira pense que c'est utile que la lecon reste courte. Marc n'est pas certain que les longues phrases soient faciles, mais il est content que les exemples parlent du cafe, de la clinique et du Quebec. Hier, Alex a lu une note qui expliquait les mots canadiens. Maintenant, il veut que Samira l'aide avec les expressions. Madame Dupont recommande que la classe ecoute deux fois, puis reponde avec une phrase courte.",
    readingEnglish: 'The class meets subjunctive-like recommendation chunks through familiar necessity, opinion, emotion, and review language.',
    listening: "Madame Dupont dit : Il faut que vous ecoutiez deux fois. Alex repond : Je suis content que la lecon soit courte. Samira ajoute : Je veux que Marc explique le mot courriel.",
    writingTest: 'Write 8 controlled sentences using common chunks. Use il faut que twice, je veux que once, je suis content que once, and at least three older review items.',
    model: "Il faut que je revise aujourd'hui. Il faut que je lise la note. Je veux que Samira m'aide. Je suis content que la lecon soit courte. Je pense que les exemples sont utiles. Hier, j'ai compris le mot courriel. Maintenant, je vais ecrire une phrase claire. Madame Dupont recommande que je pratique demain.",
    vocab: [
      t('il faut que', 'it is necessary that', 'subjunctive chunk', 'Il faut que je revise.', 'It is necessary that I review.'),
      t('je veux que', 'I want that / I want someone to', 'subjunctive chunk', 'Je veux que tu comprennes la note.', 'I want you to understand the note.'),
      t('je suis content que', 'I am happy that', 'emotion chunk', 'Je suis content que la lecon soit courte.', 'I am happy that the lesson is short.'),
      t('je suis surpris que', 'I am surprised that', 'emotion chunk', 'Je suis surpris que ce soit facile.', 'I am surprised that it is easy.'),
      t('je ne pense pas que', 'I do not think that', 'doubt chunk', 'Je ne pense pas que ce soit long.', 'I do not think that it is long.'),
      t('il est important que', 'it is important that', 'necessity chunk', 'Il est important que tu ecoutes.', 'It is important that you listen.'),
      t('il est possible que', 'it is possible that', 'doubt chunk', 'Il est possible que Marc soit malade.', 'It is possible that Marc is sick.'),
      t('je recommande que', 'I recommend that', 'recommendation', 'Je recommande que tu pratiques.', 'I recommend that you practice.'),
      t('ecouter deux fois', 'to listen twice', 'strategy', 'Il faut que vous ecoutiez deux fois.', 'It is necessary that you listen twice.'),
      t('lire attentivement', 'to read carefully', 'strategy', 'Il faut lire attentivement.', 'It is necessary to read carefully.'),
      t('repondre clairement', 'to answer clearly', 'strategy', 'Je veux que tu repondes clairement.', 'I want you to answer clearly.'),
      t('comprendre l idee', 'to understand the idea', 'comprehension', 'Alex comprend l idee principale.', 'Alex understands the main idea.'),
      t('l idee principale', 'main idea', 'comprehension', 'Quelle est l idee principale ?', 'What is the main idea?'),
      t('un detail important', 'an important detail', 'comprehension', 'Je trouve un detail important.', 'I find an important detail.'),
      t('la recommandation', 'recommendation', 'recommendation', 'La recommandation est courte.', 'The recommendation is short.'),
      t('recommander', 'to recommend', 'recommendation', 'Madame Dupont recommande une strategie.', 'Madame Dupont recommends a strategy.'),
      t('un conseil', 'advice', 'recommendation', 'Samira donne un conseil.', 'Samira gives advice.'),
      t('conseiller', 'to advise', 'recommendation', 'Le medecin conseille le repos.', 'The doctor advises rest.'),
      t('necessaire', 'necessary', 'necessity', 'La revision est necessaire.', 'Review is necessary.'),
      t('obligatoire', 'required / mandatory', 'necessity', 'Le test est obligatoire.', 'The test is mandatory.'),
      t('possible', 'possible', 'doubt', 'Il est possible de reviser demain.', 'It is possible to review tomorrow.'),
      t('certain / certaine', 'certain / sure', 'doubt', 'Je suis certain de ma reponse.', 'I am sure of my answer.'),
      t('douter', 'to doubt', 'doubt', 'Je doute de la reponse.', 'I doubt the answer.'),
      t('avoir peur que', 'to be afraid that', 'emotion chunk', 'J ai peur que ce soit difficile.', 'I am afraid that it is difficult.'),
      t('etre heureux / heureuse que', 'to be happy that', 'emotion chunk', 'Je suis heureux que ca va mieux.', 'I am happy that it is going better.'),
      t('avant de repondre', 'before answering', 'strategy', 'Lis avant de repondre.', 'Read before answering.'),
      t('apres avoir ecoute', 'after listening', 'strategy', 'Apres avoir ecoute, reponds.', 'After listening, answer.'),
      t('selon le texte', 'according to the text', 'assessment', 'Selon le texte, Alex est fatigue.', 'According to the text, Alex is tired.'),
      t('choisis la meilleure reponse', 'choose the best answer', 'assessment', 'Choisis la meilleure reponse.', 'Choose the best answer.'),
      t('justifie ta reponse', 'justify your answer', 'assessment', 'Justifie ta reponse avec un detail.', 'Justify your answer with a detail.')
    ]
  },
  22: {
    title: "La note est ecrite",
    main: 'passive voice basics',
    review: 'past participles and agreement awareness',
    newLabel: 'news, process language, passive recognition, and active/passive transformations',
    goal: 'recognize simple passive sentences and transform a few active sentences into passive patterns.',
    grammarRows: [
      ['etre + past participle', 'passive pattern', 'La note est ecrite par Samira.'],
      ['par + person', 'by someone', 'Le message est envoye par Alex.'],
      ['present passive', 'is done', 'Le formulaire est rempli a la clinique.'],
      ['past passive recognition', 'was done', 'La porte a ete fermee.'],
      ['agreement awareness', 'past participle can agree', 'La lettre est signee.'],
      ['active to passive', 'same idea, different focus', 'Samira ecrit la note -> La note est ecrite par Samira.']
    ],
    watch: 'Use passive mostly for reading recognition now. In writing, use simple transformations with known verbs.',
    reading: "A la clinique, un petit avis est affiche pres de la reception. Le message est ecrit en francais standard, mais quelques mots canadiens sont expliques par Madame Dupont. Le formulaire est donne a Alex par la receptionniste. La note est remplie avec son nom, son numero et son rendez-vous. Ensuite, le courriel est envoye par la clinique. Alex remarque que le texte est clair parce que chaque etape est expliquee. Hier, il etait inquiet, mais maintenant il comprend le processus. Samira dit que la phrase passive est utile quand l'action est plus importante que la personne.",
    readingEnglish: 'Alex reads a clinic notice and sees simple passive sentences about forms, messages, and steps in a process.',
    listening: "La receptionniste dit : Le formulaire est donne a Alex. La note est remplie ici. Le courriel est envoye par la clinique. Madame Dupont ajoute : L'action est importante.",
    writingTest: 'Transform 6 active sentences into passive sentences, then write 3 short process sentences about a clinic, class, or message.',
    model: "Samira ecrit la note. La note est ecrite par Samira. Alex envoie le courriel. Le courriel est envoye par Alex. La receptionniste donne le formulaire. Le formulaire est donne par la receptionniste. Le message est explique. La lecon est revisee. Le rendez-vous est confirme.",
    vocab: [
      t('est ecrit / ecrite', 'is written', 'passive', 'La note est ecrite par Samira.', 'The note is written by Samira.'),
      t('est envoye / envoyee', 'is sent', 'passive', 'Le courriel est envoye par Alex.', 'The email is sent by Alex.'),
      t('est donne / donnee', 'is given', 'passive', 'Le formulaire est donne a Alex.', 'The form is given to Alex.'),
      t('est rempli / remplie', 'is filled out', 'passive', 'La note est remplie a la clinique.', 'The note is filled out at the clinic.'),
      t('est explique / expliquee', 'is explained', 'passive', 'Le mot est explique en classe.', 'The word is explained in class.'),
      t('est affiche / affichee', 'is posted', 'passive', 'L avis est affiche pres de la porte.', 'The notice is posted near the door.'),
      t('par Alex', 'by Alex', 'agent', 'Le message est envoye par Alex.', 'The message is sent by Alex.'),
      t('par Samira', 'by Samira', 'agent', 'La note est ecrite par Samira.', 'The note is written by Samira.'),
      t('par la clinique', 'by the clinic', 'agent', 'Le courriel est envoye par la clinique.', 'The email is sent by the clinic.'),
      t('un avis', 'notice', 'news/process', 'Un avis est affiche.', 'A notice is posted.'),
      t('un formulaire', 'form', 'news/process', 'Le formulaire est rempli.', 'The form is filled out.'),
      t('une etape', 'step', 'process', 'Chaque etape est expliquee.', 'Each step is explained.'),
      t('le processus', 'process', 'process', 'Le processus est clair.', 'The process is clear.'),
      t('une information', 'information', 'process', 'L information est donnee.', 'The information is given.'),
      t('un document', 'document', 'process', 'Le document est signe.', 'The document is signed.'),
      t('signe / signee', 'signed', 'process', 'La note est signee.', 'The note is signed.'),
      t('confirme / confirmee', 'confirmed', 'process', 'Le rendez-vous est confirme.', 'The appointment is confirmed.'),
      t('annule / annulee', 'cancelled', 'process', 'La visite est annulee.', 'The visit is cancelled.'),
      t('recu / recue', 'received', 'process', 'La reponse est recue.', 'The answer is received.'),
      t('ouvert / ouverte', 'open / opened', 'process', 'La porte est ouverte.', 'The door is open.'),
      t('ferme / fermee', 'closed', 'process', 'La clinique est fermee.', 'The clinic is closed.'),
      t('publie / publiee', 'published', 'news', 'Le texte est publie.', 'The text is published.'),
      t('presente / presentee', 'presented', 'news', 'La nouvelle est presentee.', 'The news is presented.'),
      t('selon l avis', 'according to the notice', 'assessment', 'Selon l avis, la clinique est fermee.', 'According to the notice, the clinic is closed.'),
      t('l action', 'the action', 'grammar', 'L action est importante.', 'The action is important.'),
      t('la personne', 'the person', 'grammar', 'La personne est moins importante.', 'The person is less important.'),
      t('transformer', 'to transform', 'grammar', 'Transforme la phrase active.', 'Transform the active sentence.'),
      t('actif / active', 'active', 'grammar', 'La phrase active est courte.', 'The active sentence is short.'),
      t('passif / passive', 'passive', 'grammar', 'La phrase passive est utile.', 'The passive sentence is useful.'),
      t('changer le focus', 'to change the focus', 'grammar', 'Le passif change le focus.', 'The passive changes the focus.')
    ]
  },
  23: {
    title: "Cependant, Alex continue",
    main: 'complex connectors',
    review: 'relative clauses',
    newLabel: 'discourse markers, contrast, cause, result, and sequence',
    goal: 'link short familiar sentences into one clearer paragraph using connectors.',
    grammarRows: [
      ['cependant', 'however', 'Alex est fatigue; cependant, il continue.'],
      ['donc', 'therefore / so', 'Il pleut, donc Alex prend le bus.'],
      ['pourtant', 'yet / however', 'La phrase est longue; pourtant, elle est claire.'],
      ['pendant que', 'while', 'Samira lit pendant que Marc ecoute.'],
      ['grace a', 'thanks to', 'Alex comprend grace a Samira.'],
      ['d une part / d autre part', 'on one hand / on the other hand', 'D une part, c est utile; d autre part, c est difficile.']
    ],
    watch: 'Use one connector per sentence at first. Clarity matters more than length.',
    reading: "Alex lit un texte plus long qui parle de la clinique et du francais canadien. D'abord, il cherche l'idee principale. Ensuite, il souligne les mots qu'il connait deja. Le texte est plus difficile; cependant, il est utile. La note est ecrite clairement, donc Alex peut la comprendre. Samira l'aide pendant que Marc copie les details importants. D'une part, les expressions du Quebec sont nouvelles; d'autre part, plusieurs mots ressemblent aux mots qu'Alex connait. Grace a cette strategie, Alex repond aux questions avec plus de confiance.",
    readingEnglish: 'Alex uses connectors to follow a longer text and organize ideas, while reviewing relative clauses, pronouns, passive, and Canadian French recognition.',
    listening: "Madame Dupont dit : D'abord, cherchez l'idee principale. Ensuite, trouvez un detail. Le texte est long; cependant, il est clair. Donc, vous pouvez repondre avec confiance.",
    writingTest: 'Write a linked paragraph of 8-10 sentences. Use at least six connectors, one relative clause with qui or que, and one review sentence with a pronoun.',
    model: "D'abord, je lis le texte. Ensuite, je cherche l'idee principale. Le texte est long; cependant, il est clair. Il parle d'une clinique qui est pres du parc. Samira m'aide pendant que Marc copie les details. Donc, je comprends mieux. D'une part, les mots canadiens sont nouveaux; d'autre part, ils sont utiles. Grace a la revision, je peux repondre.",
    vocab: [
      t('cependant', 'however', 'connector', 'Alex est fatigue; cependant, il continue.', 'Alex is tired; however, he continues.'),
      t('donc', 'therefore / so', 'connector', 'Il pleut, donc Alex prend le bus.', 'It is raining, so Alex takes the bus.'),
      t('pourtant', 'yet / however', 'connector', 'La phrase est longue; pourtant, elle est claire.', 'The sentence is long; yet it is clear.'),
      t('pendant que', 'while', 'connector', 'Samira lit pendant que Marc ecoute.', 'Samira reads while Marc listens.'),
      t('grace a', 'thanks to', 'connector', 'Alex comprend grace a Samira.', 'Alex understands thanks to Samira.'),
      t('a cause de', 'because of', 'connector', 'Alex reste a la maison a cause de la pluie.', 'Alex stays home because of the rain.'),
      t('d une part', 'on one hand', 'connector', 'D une part, c est utile.', 'On one hand, it is useful.'),
      t('d autre part', 'on the other hand', 'connector', 'D autre part, c est difficile.', 'On the other hand, it is difficult.'),
      t('en plus', 'in addition', 'connector', 'En plus, le texte est court.', 'In addition, the text is short.'),
      t('par contre', 'on the other hand', 'connector', 'Par contre, le quiz est long.', 'On the other hand, the quiz is long.'),
      t('ainsi', 'thus / in this way', 'connector', 'Ainsi, Alex comprend mieux.', 'Thus, Alex understands better.'),
      t('malgre', 'despite', 'connector', 'Malgre la pluie, Alex va en classe.', 'Despite the rain, Alex goes to class.'),
      t('meme si', 'even if', 'connector', 'Meme si c est difficile, je continue.', 'Even if it is difficult, I continue.'),
      t('en effet', 'indeed / in fact', 'connector', 'En effet, la note est claire.', 'Indeed, the note is clear.'),
      t('finalement', 'finally', 'connector review', 'Finalement, Alex repond.', 'Finally, Alex answers.'),
      t('resumer', 'to summarize', 'writing', 'Je vais resumer le texte.', 'I am going to summarize the text.'),
      t('organiser', 'to organize', 'writing', 'Je dois organiser mes idees.', 'I must organize my ideas.'),
      t('relier', 'to connect', 'writing', 'Je relie deux phrases.', 'I connect two sentences.'),
      t('un paragraphe', 'paragraph', 'writing', 'Mon paragraphe est clair.', 'My paragraph is clear.'),
      t('une transition', 'transition', 'writing', 'Cette transition est utile.', 'This transition is useful.'),
      t('la cause', 'cause', 'logic', 'Quelle est la cause ?', 'What is the cause?'),
      t('le resultat', 'result', 'logic', 'Quel est le resultat ?', 'What is the result?'),
      t('le contraste', 'contrast', 'logic', 'Le contraste est clair.', 'The contrast is clear.'),
      t('la sequence', 'sequence', 'logic', 'La sequence est simple.', 'The sequence is simple.'),
      t('un argument', 'argument', 'writing', 'Je donne un argument court.', 'I give a short argument.'),
      t('un exemple', 'example', 'writing', 'Je donne un exemple.', 'I give an example.'),
      t('la confiance', 'confidence', 'feeling', 'Alex repond avec confiance.', 'Alex answers with confidence.'),
      t('souligner', 'to underline', 'strategy', 'Je souligne les mots connus.', 'I underline known words.'),
      t('chercher', 'to look for', 'strategy', 'Je cherche l idee principale.', 'I look for the main idea.'),
      t('trouver', 'to find', 'strategy', 'Je trouve un detail important.', 'I find an important detail.')
    ]
  },
  24: {
    title: "Bonjour Madame, je vous ecris",
    main: 'formal vs informal register',
    review: 'politeness and conditional',
    newLabel: 'formal email, informal message, greetings, closings, and register choices',
    goal: 'compare informal and formal messages and write a short formal email with polite chunks.',
    grammarRows: [
      ['formal greeting', 'start politely', 'Bonjour Madame Dupont,'],
      ['je vous ecris pour', 'I am writing to', 'Je vous ecris pour confirmer mon rendez-vous.'],
      ['conditional politeness', 'polite request', 'Pourriez-vous confirmer l heure ?'],
      ['formal closing', 'end politely', 'Merci beaucoup. Bonne journee.'],
      ['informal message', 'friend message', 'Salut Samira, tu peux m aider ?'],
      ['same idea, different register', 'compare tone', 'Salut -> Bonjour Madame']
    ],
    watch: 'Match the message to the person. Use formal language for clinics, teachers, services, and unfamiliar adults.',
    reading: "Alex compare deux messages. Le premier est pour Samira : Salut Samira, tu peux m'aider avec le texte ? Merci ! Le deuxieme est pour Madame Dupont : Bonjour Madame Dupont, je vous ecris pour demander une aide avec le texte. Pourriez-vous m'envoyer l'exemple, s'il vous plait ? Merci beaucoup. Bonne journee. Madame Dupont explique que les deux messages sont corrects, mais le registre change. Avec une amie, Alex peut etre simple et direct. Avec la clinique ou une professeure, il utilise vous, je voudrais et pourriez-vous. Cette difference est importante pour les courriels au Canada.",
    readingEnglish: 'Alex compares informal and formal messages and notices how greetings, pronouns, polite requests, and closings change.',
    listening: "Madame Dupont lit deux messages. Un message dit : Salut Samira, tu peux m'aider ? L'autre dit : Bonjour Madame, pourriez-vous confirmer mon rendez-vous ? Alex choisit le registre formel pour la clinique.",
    writingTest: 'Write one informal message to Samira and one formal email to Madame Dupont or the clinic. Use a greeting, reason, polite request, and closing.',
    model: "Salut Samira, tu peux m'aider avec le texte ? Je ne comprends pas le mot courriel. Merci ! Bonjour Madame Dupont, je vous ecris pour demander une aide avec la lecon. Pourriez-vous m'envoyer un exemple, s'il vous plait ? Je vous remercie. Bonne journee.",
    vocab: [
      t('formel / formelle', 'formal', 'register', 'Ce message est formel.', 'This message is formal.'),
      t('informel / informelle', 'informal', 'register', 'Ce message est informel.', 'This message is informal.'),
      t('le registre', 'register / tone', 'register', 'Le registre change.', 'The register changes.'),
      t('Bonjour Madame', 'Hello Madam', 'formal greeting', 'Bonjour Madame, je vous ecris.', 'Hello Madam, I am writing to you.'),
      t('Bonjour Monsieur', 'Hello Sir', 'formal greeting', 'Bonjour Monsieur, je voudrais une information.', 'Hello Sir, I would like information.'),
      t('Salut', 'hi', 'informal greeting', 'Salut Samira, ca va ?', 'Hi Samira, how are you?'),
      t('Cher / chere', 'dear', 'formal greeting', 'Chere Madame Dupont, merci.', 'Dear Madame Dupont, thank you.'),
      t('je vous ecris pour', 'I am writing to you to', 'formal message', 'Je vous ecris pour confirmer.', 'I am writing to confirm.'),
      t('je vous remercie', 'I thank you', 'formal closing', 'Je vous remercie pour votre aide.', 'I thank you for your help.'),
      t('cordialement', 'sincerely / regards', 'formal closing', 'Cordialement, Alex.', 'Regards, Alex.'),
      t('bonne journee', 'have a good day', 'closing', 'Merci et bonne journee.', 'Thank you and have a good day.'),
      t('a bientot', 'see you soon', 'informal closing', 'A bientot, Samira.', 'See you soon, Samira.'),
      t('tu peux', 'you can informal', 'informal request', 'Tu peux m aider ?', 'Can you help me?'),
      t('vous pouvez', 'you can formal/plural', 'formal request', 'Vous pouvez confirmer ?', 'Can you confirm?'),
      t('pourriez-vous', 'could you formal', 'formal request', 'Pourriez-vous m envoyer l exemple ?', 'Could you send me the example?'),
      t('m envoyer', 'send me', 'message', 'Pourriez-vous m envoyer un courriel ?', 'Could you send me an email?'),
      t('me confirmer', 'confirm for me', 'message', 'Pourriez-vous me confirmer l heure ?', 'Could you confirm the time for me?'),
      t('me repondre', 'reply to me', 'message', 'Pourriez-vous me repondre demain ?', 'Could you reply to me tomorrow?'),
      t('un courriel formel', 'formal email', 'message', 'J ecris un courriel formel.', 'I write a formal email.'),
      t('un message court', 'short message', 'message', 'Samira envoie un message court.', 'Samira sends a short message.'),
      t('la salutation', 'greeting', 'message structure', 'La salutation est polie.', 'The greeting is polite.'),
      t('la formule de politesse', 'polite closing', 'message structure', 'La formule de politesse est correcte.', 'The polite closing is correct.'),
      t('le destinataire', 'recipient', 'message structure', 'Le destinataire est Madame Dupont.', 'The recipient is Madame Dupont.'),
      t('l objet', 'subject line', 'message structure', 'L objet du courriel est rendez-vous.', 'The email subject is appointment.'),
      t('le ton', 'tone', 'register', 'Le ton est respectueux.', 'The tone is respectful.'),
      t('respectueux / respectueuse', 'respectful', 'register', 'Le message est respectueux.', 'The message is respectful.'),
      t('direct / directe', 'direct', 'register', 'Le message a Samira est direct.', 'The message to Samira is direct.'),
      t('professionnel / professionnelle', 'professional', 'register', 'Le courriel est professionnel.', 'The email is professional.'),
      t('adapter', 'to adapt', 'register', 'J adapte le registre.', 'I adapt the register.'),
      t('selon la personne', 'depending on the person', 'register', 'Je choisis selon la personne.', 'I choose depending on the person.')
    ]
  },
  25: {
    title: "Strategies CLB: lire, ecouter, repondre",
    main: 'review and CLB strategy training',
    review: 'targeted weak points from Weeks 1-24',
    newLabel: 'instruction words, question stems, test strategies, and summary language',
    goal: 'use test instructions, identify main ideas and details, and write a short summary-response with familiar grammar.',
    grammarRows: [
      ['no major new grammar', 'review and strategy focus', 'Lis la question avant le texte.'],
      ['identify task', 'what does the question ask?', 'La question demande un detail.'],
      ['main idea', 'global understanding', 'L idee principale est claire.'],
      ['evidence', 'support an answer', 'Je trouve la preuve dans le texte.'],
      ['summary frame', 'short response', 'Le texte explique que Alex doit confirmer un rendez-vous.'],
      ['personal response', 'controlled opinion', 'Je pense que cette strategie est utile.']
    ],
    watch: 'Week 25 is a strategy week. Slow down, identify the task, find evidence, and answer with controlled language.',
    reading: "Madame Dupont prepare un exercice de strategie. D'abord, Alex lit les questions avant le texte. Ensuite, il cherche l'idee principale. Le texte explique qu'une clinique envoie un courriel formel pour confirmer un rendez-vous. Samira souligne les details : l'heure, l'adresse, et la formule de politesse. Marc trouve une phrase qui utilise que et une phrase passive qui est ecrite clairement. La question demande : Pourquoi Alex doit-il repondre ? Alex trouve la preuve dans le texte : il doit confirmer le rendez-vous. Finalement, il ecrit une reponse courte avec son opinion.",
    readingEnglish: 'The class practices CLB-style reading strategy: preview questions, find main idea, locate details, identify grammar clues, and write a supported answer.',
    listening: "Madame Dupont dit : Ecoutez la question d'abord. Puis, notez deux mots cles. La question demande l'idee principale. Alex repond : Le message confirme un rendez-vous a la clinique.",
    writingTest: 'Write a short summary and response. Include 3 sentences summarizing a message or notice, 2 evidence sentences, and 2 opinion or next-step sentences.',
    model: "Le texte explique qu'Alex a un rendez-vous a la clinique. Le courriel donne l'heure et l'adresse. Il est ecrit dans un registre formel. La preuve est la phrase : pourriez-vous confirmer l'heure ? Un autre detail est le numero de telephone. Je pense que le message est clair. Je vais repondre avec une phrase courte et polie.",
    vocab: [
      t('lis la question', 'read the question', 'instruction', 'Lis la question avant le texte.', 'Read the question before the text.'),
      t('ecoute deux fois', 'listen twice', 'instruction', 'Ecoute deux fois avant de repondre.', 'Listen twice before answering.'),
      t('choisis la bonne reponse', 'choose the correct answer', 'instruction', 'Choisis la bonne reponse.', 'Choose the correct answer.'),
      t('coche vrai ou faux', 'check true or false', 'instruction', 'Coche vrai ou faux.', 'Check true or false.'),
      t('complete la phrase', 'complete the sentence', 'instruction', 'Complete la phrase avec un mot.', 'Complete the sentence with a word.'),
      t('associe les mots', 'match the words', 'instruction', 'Associe les mots aux definitions.', 'Match the words to the definitions.'),
      t('trouve la preuve', 'find the evidence', 'strategy', 'Trouve la preuve dans le texte.', 'Find the evidence in the text.'),
      t('souligne les mots cles', 'underline the keywords', 'strategy', 'Souligne les mots cles.', 'Underline the keywords.'),
      t('note un detail', 'note one detail', 'strategy', 'Note un detail important.', 'Note one important detail.'),
      t('ignore les mots inconnus', 'ignore unknown words', 'strategy', 'Ignore les mots inconnus au debut.', 'Ignore unknown words at first.'),
      t('devine avec le contexte', 'guess with context', 'strategy', 'Devine avec le contexte.', 'Guess with context.'),
      t('verifie ta reponse', 'check your answer', 'strategy', 'Verifie ta reponse avec le texte.', 'Check your answer with the text.'),
      t('l idee principale', 'main idea', 'question stem', 'Quelle est l idee principale ?', 'What is the main idea?'),
      t('le but du texte', 'purpose of the text', 'question stem', 'Quel est le but du texte ?', 'What is the purpose of the text?'),
      t('un detail precis', 'specific detail', 'question stem', 'Trouve un detail precis.', 'Find a specific detail.'),
      t('la preuve', 'evidence', 'question stem', 'La preuve est dans la phrase.', 'The evidence is in the sentence.'),
      t('selon le texte', 'according to the text', 'question stem', 'Selon le texte, Alex appelle la clinique.', 'According to the text, Alex calls the clinic.'),
      t('pourquoi', 'why', 'question stem', 'Pourquoi Alex ecrit-il ?', 'Why does Alex write?'),
      t('comment', 'how', 'question stem', 'Comment Samira aide-t-elle ?', 'How does Samira help?'),
      t('qui parle', 'who is speaking', 'listening', 'Qui parle dans le dialogue ?', 'Who is speaking in the dialogue?'),
      t('ou se passe la scene', 'where the scene takes place', 'listening', 'Ou se passe la scene ?', 'Where does the scene take place?'),
      t('quel est le probleme', 'what is the problem', 'listening', 'Quel est le probleme ?', 'What is the problem?'),
      t('un resume', 'summary', 'writing', 'J ecris un resume court.', 'I write a short summary.'),
      t('resumer', 'to summarize', 'writing', 'Je vais resumer le message.', 'I am going to summarize the message.'),
      t('repondre avec preuve', 'answer with evidence', 'writing', 'Je reponds avec une preuve.', 'I answer with evidence.'),
      t('donner son opinion', 'give an opinion', 'writing', 'Je donne mon opinion.', 'I give my opinion.'),
      t('une prochaine etape', 'next step', 'writing', 'Ma prochaine etape est claire.', 'My next step is clear.'),
      t('en une phrase', 'in one sentence', 'instruction', 'Reponds en une phrase.', 'Answer in one sentence.'),
      t('en deux details', 'with two details', 'instruction', 'Justifie avec deux details.', 'Justify with two details.'),
      t('avant de finir', 'before finishing', 'strategy', 'Avant de finir, verifie ta reponse.', 'Before finishing, check your answer.')
    ]
  },
  26: {
    title: "Nouvelles simples: le quartier",
    main: 'news style review',
    review: 'passive, past narration, and connectors',
    newLabel: 'current events, public topics, simplified news, and summary verbs',
    goal: 'read and summarize a short news-style text using passive voice, past narration, and connectors.',
    grammarRows: [
      ['news headline style', 'short public-topic title', 'Un avis est publie dans le quartier.'],
      ['passive review', 'focus on event/process', 'Le message est envoye par la clinique.'],
      ['past review', 'what happened', 'Hier, la pluie a cause un retard.'],
      ['connector review', 'link cause/result', 'Il pleuvait, donc le bus etait en retard.'],
      ['summary verb', 'report main idea', 'Le texte explique que le service change.'],
      ['source phrase', 'according to', 'Selon l avis, la clinique ouvre a huit heures.']
    ],
    watch: 'News style often focuses on what happened, where, and why. Find the main event before translating every word.',
    reading: "Un avis est publie dans le quartier d'Alex. Selon l'avis, la clinique sera fermee vendredi matin parce qu'un nouveau service est prepare. Le courriel est envoye aux patients par la receptionniste. Hier, Alex a recu le message sur son cellulaire. Il etait surpris; cependant, le texte etait clair. La nouvelle explique que les rendez-vous sont confirmes pour lundi prochain. Samira lit le message que Alex lui montre, puis elle souligne l'idee principale. Marc trouve deux details: l'heure et l'adresse. Finalement, Alex ecrit un resume court pour Madame Dupont.",
    readingEnglish: 'A simplified neighborhood notice uses passive voice, past narration, connectors, and CLB summary strategy.',
    listening: "Madame Dupont dit : Selon l'avis, la clinique est fermee vendredi matin. Le courriel est envoye aux patients. Alex resume : Le service change, donc les rendez-vous sont confirmes pour lundi.",
    writingTest: 'Write a short news summary of 7-9 sentences. Include the main event, where it happens, one reason, two details, and one personal next step.',
    model: "Le texte parle d'un avis dans le quartier. Selon l'avis, la clinique est fermee vendredi matin. Le courriel est envoye aux patients. Le service change parce qu'un nouveau systeme est prepare. Alex a recu le message hier. L'idee principale est claire. Je pense que le message est utile. Je vais confirmer mon rendez-vous lundi.",
    vocab: [
      t('une nouvelle', 'news item', 'news', 'La nouvelle est courte.', 'The news item is short.'),
      t('un avis public', 'public notice', 'news', 'Un avis public est affiche.', 'A public notice is posted.'),
      t('selon l avis', 'according to the notice', 'news', 'Selon l avis, la clinique est fermee.', 'According to the notice, the clinic is closed.'),
      t('le quartier', 'neighborhood', 'public topic', 'Le quartier est calme.', 'The neighborhood is calm.'),
      t('le service', 'service', 'public topic', 'Le service change lundi.', 'The service changes Monday.'),
      t('un changement', 'change', 'public topic', 'Le changement est important.', 'The change is important.'),
      t('un retard', 'delay', 'public topic', 'Le bus a un retard.', 'The bus has a delay.'),
      t('une annonce', 'announcement', 'news', 'Une annonce est publiee.', 'An announcement is published.'),
      t('publier', 'to publish', 'news', 'La ville publie un avis.', 'The city publishes a notice.'),
      t('annoncer', 'to announce', 'news', 'La clinique annonce un changement.', 'The clinic announces a change.'),
      t('informer', 'to inform', 'news', 'Le message informe les patients.', 'The message informs the patients.'),
      t('signaler', 'to report / signal', 'news', 'Le texte signale un retard.', 'The text reports a delay.'),
      t('expliquer que', 'to explain that', 'summary', 'Le texte explique que le service change.', 'The text explains that the service changes.'),
      t('indiquer que', 'to indicate that', 'summary', 'L avis indique que la clinique ouvre a huit heures.', 'The notice indicates that the clinic opens at eight.'),
      t('resumer la nouvelle', 'to summarize the news', 'summary', 'Alex resume la nouvelle.', 'Alex summarizes the news.'),
      t('le sujet', 'topic', 'summary', 'Le sujet est le quartier.', 'The topic is the neighborhood.'),
      t('l evenement', 'event', 'summary', 'L evenement est explique.', 'The event is explained.'),
      t('la date', 'date', 'detail', 'La date est vendredi.', 'The date is Friday.'),
      t('le lieu', 'place / location', 'detail', 'Le lieu est la clinique.', 'The location is the clinic.'),
      t('la raison', 'reason', 'detail', 'La raison est claire.', 'The reason is clear.'),
      t('les patients', 'patients', 'public topic', 'Les patients recoivent un courriel.', 'The patients receive an email.'),
      t('la ville', 'city', 'public topic', 'La ville publie un avis.', 'The city publishes a notice.'),
      t('le transport', 'transportation', 'public topic', 'Le transport est en retard.', 'Transportation is delayed.'),
      t('la meteo', 'weather', 'public topic', 'La meteo cause un retard.', 'The weather causes a delay.'),
      t('ouvrir a huit heures', 'to open at eight', 'public topic', 'La clinique va ouvrir a huit heures.', 'The clinic is going to open at eight.'),
      t('fermer vendredi', 'to close Friday', 'public topic', 'Le bureau va fermer vendredi.', 'The office is going to close Friday.'),
      t('etre confirme / confirmee', 'to be confirmed', 'passive review', 'Le rendez-vous est confirme.', 'The appointment is confirmed.'),
      t('etre reporte / reportee', 'to be postponed', 'passive', 'La visite est reportee.', 'The visit is postponed.'),
      t('a partir de', 'starting from', 'time', 'A partir de lundi, le service change.', 'Starting Monday, the service changes.'),
      t('jusqu a', 'until', 'time', 'La clinique est fermee jusqu a midi.', 'The clinic is closed until noon.')
    ]
  },
  27: {
    title: "Un court rapport pour le bureau",
    main: 'formal complex sentence control',
    review: 'formal register',
    newLabel: 'workplace, study, report, notice, and analysis verbs',
    goal: 'write a short professional message or report with controlled connectors and formal tone.',
    grammarRows: [
      ['formal purpose', 'why the report exists', 'Ce rapport presente un changement.'],
      ['analysis verb', 'explain information', 'Le texte analyse le probleme.'],
      ['connector control', 'organized formal writing', 'Cependant, une solution est proposee.'],
      ['passive review', 'formal process', 'Le document est envoye par courriel.'],
      ['recommendation', 'next step', 'Il est recommande de confirmer l heure.'],
      ['summary + action', 'professional close', 'Je vous remercie de votre attention.']
    ],
    watch: 'Keep formal writing organized: topic, detail, result, next step. Use fewer but clearer connectors.',
    reading: "Au bureau de la classe, Madame Dupont montre un court rapport. Le rapport presente un changement d'horaire pour un atelier de francais. Le document est envoye par courriel aux apprenants. D'abord, le texte explique le probleme: plusieurs personnes ont un rendez-vous a la clinique vendredi matin. Ensuite, il propose une solution: l'atelier est reporte a lundi. Cependant, les devoirs de lecture sont maintenus. Alex analyse le message et trouve trois details: la date, l'heure et la prochaine etape. Il ecrit une reponse professionnelle pour confirmer qu'il a compris.",
    readingEnglish: 'A short formal report/notice explains a schedule change and asks learners to confirm understanding.',
    listening: "Madame Dupont dit : Le rapport presente un changement d'horaire. L'atelier est reporte a lundi. Alex repond : Je comprends la prochaine etape et je vais confirmer par courriel.",
    writingTest: 'Write a professional message or short report of 8-10 sentences. Include topic, reason, two details, result, and next step with formal register.',
    model: "Bonjour Madame Dupont. Ce court rapport presente un changement d'horaire. L'atelier de francais est reporte a lundi. La raison est un rendez-vous a la clinique vendredi matin. Cependant, la lecture est maintenue. Le document est envoye par courriel. Je comprends la prochaine etape. Je vais confirmer ma presence. Je vous remercie de votre attention.",
    vocab: [
      t('un rapport', 'report', 'formal work', 'Le rapport est court.', 'The report is short.'),
      t('un avis interne', 'internal notice', 'formal work', 'Un avis interne est envoye.', 'An internal notice is sent.'),
      t('un atelier', 'workshop', 'study/work', 'L atelier est reporte a lundi.', 'The workshop is postponed to Monday.'),
      t('un horaire', 'schedule', 'study/work', 'L horaire change vendredi.', 'The schedule changes Friday.'),
      t('un changement d horaire', 'schedule change', 'study/work', 'Le rapport presente un changement d horaire.', 'The report presents a schedule change.'),
      t('presenter', 'to present', 'analysis', 'Le rapport presente le probleme.', 'The report presents the problem.'),
      t('analyser', 'to analyze', 'analysis', 'Alex analyse le message.', 'Alex analyzes the message.'),
      t('proposer', 'to propose', 'analysis', 'Madame Dupont propose une solution.', 'Madame Dupont proposes a solution.'),
      t('maintenir', 'to maintain / keep', 'formal action', 'La lecture est maintenue.', 'The reading is maintained.'),
      t('reporter', 'to postpone', 'formal action', 'L atelier est reporte.', 'The workshop is postponed.'),
      t('confirmer sa presence', 'to confirm attendance', 'formal action', 'Je vais confirmer ma presence.', 'I am going to confirm my attendance.'),
      t('comprendre la prochaine etape', 'to understand the next step', 'formal action', 'Je comprends la prochaine etape.', 'I understand the next step.'),
      t('une solution', 'solution', 'analysis', 'La solution est claire.', 'The solution is clear.'),
      t('un probleme', 'problem', 'analysis', 'Le probleme est explique.', 'The problem is explained.'),
      t('une consequence', 'consequence', 'analysis', 'La consequence est simple.', 'The consequence is simple.'),
      t('un resultat', 'result', 'analysis', 'Le resultat est positif.', 'The result is positive.'),
      t('une priorite', 'priority', 'work', 'La priorite est la sante.', 'The priority is health.'),
      t('une tache', 'task', 'work', 'La tache est courte.', 'The task is short.'),
      t('un delai', 'deadline', 'work', 'Le delai est lundi.', 'The deadline is Monday.'),
      t('une equipe', 'team', 'work', 'L equipe travaille ensemble.', 'The team works together.'),
      t('un collegue', 'colleague', 'work', 'Marc est un collegue.', 'Marc is a colleague.'),
      t('une apprenante', 'female learner', 'study', 'Samira est une apprenante.', 'Samira is a learner.'),
      t('un apprenant', 'male learner', 'study', 'Alex est un apprenant.', 'Alex is a learner.'),
      t('professionnellement', 'professionally', 'register', 'Alex repond professionnellement.', 'Alex answers professionally.'),
      t('de facon claire', 'clearly / in a clear way', 'register', 'Je reponds de facon claire.', 'I answer clearly.'),
      t('je vous confirme que', 'I confirm to you that', 'formal chunk', 'Je vous confirme que je comprends.', 'I confirm that I understand.'),
      t('je vous informe que', 'I inform you that', 'formal chunk', 'Je vous informe que je serai absent.', 'I inform you that I will be absent.'),
      t('merci de votre attention', 'thank you for your attention', 'formal closing', 'Merci de votre attention.', 'Thank you for your attention.'),
      t('suite a', 'following / after', 'formal connector', 'Suite a votre message, je confirme.', 'Following your message, I confirm.'),
      t('concernant', 'concerning / regarding', 'formal connector', 'Concernant l atelier, je confirme.', 'Regarding the workshop, I confirm.')
    ]
  },
  28: {
    title: "Je deduis avec les indices",
    main: 'inference and discourse tracking',
    review: 'connectors and pronouns',
    newLabel: 'inference signals, evidence language, speaker tracking, and paragraph response',
    goal: 'track who/what pronouns refer to, infer simple meaning, and support answers with evidence.',
    grammarRows: [
      ['pronoun tracking', 'what does it refer to?', 'Alex lit la note. Il la comprend.'],
      ['inference signal', 'not directly said', 'On peut deduire que Alex est inquiet.'],
      ['evidence phrase', 'support answer', 'La preuve est dans la deuxieme phrase.'],
      ['connector tracking', 'why ideas are linked', 'Cependant montre un contraste.'],
      ['speaker tracking', 'who says what', 'Samira lui repond apres la question.'],
      ['paragraph answer', 'claim + evidence', 'Je pense que..., parce que le texte dit...']
    ],
    watch: 'For inference, do not guess wildly. Use pronouns, connectors, and evidence from the text.',
    reading: "Alex lit un long message qui vient de la clinique. Le message ne dit pas directement qu'il doit changer son plan, mais plusieurs indices sont clairs. D'abord, le rendez-vous est reporte a lundi. Ensuite, le courriel indique que la clinique est fermee vendredi. Donc, on peut deduire qu'Alex ne va pas aller a la clinique vendredi. Samira lui demande : Qu'est-ce que tu vas faire ? Il repond qu'il va confirmer sa presence pour lundi. Le mot lui renvoie a Alex dans la question de Samira. Cependant montre que le plan change, mais que la situation reste organisee. Alex ecrit une reponse avec preuve.",
    readingEnglish: 'Alex uses clues, pronouns, connectors, and evidence to infer what he should do after a clinic message.',
    listening: "Madame Dupont dit : Le message ne donne pas la reponse directement. Cherchez les indices. Le rendez-vous est reporte, donc Alex doit changer son plan. Le mot il renvoie a Alex.",
    writingTest: 'Write a paragraph response with 1 inference, 2 evidence sentences, 1 pronoun explanation, and 1 connector explanation.',
    model: "Je deduis qu'Alex doit changer son plan. La preuve est que le rendez-vous est reporte a lundi. Le texte dit aussi que la clinique est fermee vendredi. Le pronom il renvoie a Alex. Le connecteur donc montre le resultat. A mon avis, Alex doit confirmer sa presence par courriel.",
    vocab: [
      t('deduire', 'to infer', 'inference', 'Je peux deduire la reponse.', 'I can infer the answer.'),
      t('on peut deduire que', 'one can infer that', 'inference', 'On peut deduire que Alex est inquiet.', 'One can infer that Alex is worried.'),
      t('un indice', 'clue', 'inference', 'Je trouve un indice dans le texte.', 'I find a clue in the text.'),
      t('directement', 'directly', 'inference', 'Le texte ne le dit pas directement.', 'The text does not say it directly.'),
      t('indirectement', 'indirectly', 'inference', 'La reponse est donnee indirectement.', 'The answer is given indirectly.'),
      t('renvoyer a', 'to refer to', 'pronoun tracking', 'Il renvoie a Alex.', 'It refers to Alex.'),
      t('le pronom', 'pronoun', 'pronoun tracking', 'Le pronom est il.', 'The pronoun is he/it.'),
      t('la reference', 'reference', 'pronoun tracking', 'La reference est claire.', 'The reference is clear.'),
      t('qui parle', 'who is speaking', 'speaker tracking', 'Qui parle dans ce passage ?', 'Who is speaking in this passage?'),
      t('qui repond', 'who answers', 'speaker tracking', 'Qui repond a Samira ?', 'Who answers Samira?'),
      t('le locuteur', 'speaker', 'speaker tracking', 'Le locuteur est Alex.', 'The speaker is Alex.'),
      t('le point de vue', 'point of view', 'discourse', 'Le point de vue change.', 'The point of view changes.'),
      t('le ton', 'tone', 'discourse', 'Le ton est formel.', 'The tone is formal.'),
      t('le contraste', 'contrast', 'connector review', 'Cependant montre un contraste.', 'However shows contrast.'),
      t('la cause', 'cause', 'connector review', 'Parce que montre la cause.', 'Because shows the cause.'),
      t('le resultat', 'result', 'connector review', 'Donc montre le resultat.', 'Therefore shows the result.'),
      t('la preuve textuelle', 'textual evidence', 'evidence', 'Je donne une preuve textuelle.', 'I give textual evidence.'),
      t('la deuxieme phrase', 'the second sentence', 'evidence', 'La preuve est dans la deuxieme phrase.', 'The evidence is in the second sentence.'),
      t('citer', 'to cite / quote', 'evidence', 'Je cite un mot du texte.', 'I cite a word from the text.'),
      t('appuyer la reponse', 'to support the answer', 'evidence', 'Je dois appuyer la reponse.', 'I must support the answer.'),
      t('une hypothese', 'hypothesis', 'inference', 'Mon hypothese est simple.', 'My hypothesis is simple.'),
      t('probable', 'likely', 'inference', 'C est probable.', 'It is likely.'),
      t('peu probable', 'unlikely', 'inference', 'C est peu probable.', 'It is unlikely.'),
      t('il semble que', 'it seems that', 'inference', 'Il semble que Alex comprend.', 'It seems that Alex understands.'),
      t('cela montre que', 'this shows that', 'evidence', 'Cela montre que le plan change.', 'This shows that the plan changes.'),
      t('cela signifie que', 'this means that', 'inference', 'Cela signifie que la clinique est fermee.', 'This means that the clinic is closed.'),
      t('suivre le fil', 'to follow the thread', 'discourse', 'Je suis le fil du texte.', 'I follow the thread of the text.'),
      t('reperer', 'to spot / locate', 'strategy', 'Je repere les indices.', 'I spot the clues.'),
      t('verifier dans le texte', 'to check in the text', 'strategy', 'Je verifie dans le texte.', 'I check in the text.'),
      t('eviter de deviner', 'to avoid guessing', 'strategy', 'Il faut eviter de deviner sans preuve.', 'It is necessary to avoid guessing without evidence.')
    ]
  },
  29: {
    title: "Mock CLB: lecture, ecoute, ecriture",
    main: 'review only mock CLB practice',
    review: 'personalized weak points across the course',
    newLabel: 'minimal new language, timed practice, and mock task routines',
    goal: 'complete mixed CLB-style reading, listening, and writing tasks with familiar language and evidence.',
    grammarRows: [
      ['review only', 'no major new grammar', 'Je lis, je trouve la preuve, je reponds.'],
      ['timed routine', 'practice with a limit', 'Je travaille pendant vingt minutes.'],
      ['mixed grammar', 'notice familiar forms', 'Le message est ecrit et je le comprends.'],
      ['evidence answer', 'support every response', 'Selon le texte, le rendez-vous est reporte.'],
      ['writing plan', 'plan before writing', 'D abord, je fais un plan.'],
      ['final check', 'review before finishing', 'Avant de finir, je verifie mes verbes.']
    ],
    watch: 'This is a mock-practice week. Use familiar tools: task, evidence, answer, check.',
    reading: "Madame Dupont organise un mock CLB court. Alex lit d'abord un avis formel qui annonce un changement d'horaire. Il souligne l'idee principale, puis il trouve deux details. Ensuite, il ecoute un dialogue entre Samira et la receptionniste. Le dialogue parle d'un rendez-vous qui est reporte. Marc aide Alex a suivre les pronoms : le message, il le lit; la note, il la comprend. Finalement, Alex ecrit une reponse en sept phrases. Il donne un resume, une preuve et son opinion. Avant de finir, il verifie les verbes, les articles et les connecteurs.",
    readingEnglish: 'A short mock CLB practice combines reading, listening, pronoun tracking, formal register, evidence, summary, and final checking.',
    listening: "Madame Dupont dit : Vous avez vingt minutes. Lisez la question, trouvez la preuve, puis repondez. Alex dit : Je vais faire un plan et verifier mes verbes avant de finir.",
    writingTest: 'Timed mock writing: in 20 minutes, write 7-9 sentences. Summarize a notice, give two evidence details, and write your next step or opinion.',
    model: "Le texte est un avis formel. Il annonce un changement d'horaire. Selon le texte, le rendez-vous est reporte a lundi. La preuve est dans la deuxieme phrase. Le message est envoye par courriel. Je pense que l'avis est clair. Ma prochaine etape est de confirmer ma presence. Avant de finir, je verifie mes verbes.",
    vocab: [
      t('un mock CLB', 'mock CLB', 'mock practice', 'Madame Dupont organise un mock CLB.', 'Madame Dupont organizes a mock CLB.'),
      t('un test blanc', 'practice test', 'mock practice', 'Je fais un test blanc.', 'I do a practice test.'),
      t('pendant vingt minutes', 'for twenty minutes', 'timing', 'Je travaille pendant vingt minutes.', 'I work for twenty minutes.'),
      t('le temps limite', 'time limit', 'timing', 'Le temps limite est court.', 'The time limit is short.'),
      t('gerer le temps', 'to manage time', 'timing', 'Je dois gerer le temps.', 'I must manage time.'),
      t('faire un plan', 'to make a plan', 'writing strategy', 'D abord, je fais un plan.', 'First, I make a plan.'),
      t('relire', 'to reread', 'checking', 'Je relis ma reponse.', 'I reread my answer.'),
      t('corriger', 'to correct', 'checking', 'Je corrige mes verbes.', 'I correct my verbs.'),
      t('verifier les verbes', 'to check verbs', 'checking', 'Je verifie les verbes.', 'I check the verbs.'),
      t('verifier les articles', 'to check articles', 'checking', 'Je verifie les articles.', 'I check the articles.'),
      t('verifier les connecteurs', 'to check connectors', 'checking', 'Je verifie les connecteurs.', 'I check the connectors.'),
      t('reponse complete', 'complete answer', 'assessment', 'Ma reponse est complete.', 'My answer is complete.'),
      t('reponse incomplete', 'incomplete answer', 'assessment', 'Ma reponse est incomplete.', 'My answer is incomplete.'),
      t('hors sujet', 'off topic', 'assessment', 'Cette phrase est hors sujet.', 'This sentence is off topic.'),
      t('dans le temps', 'within the time', 'timing', 'Je finis dans le temps.', 'I finish within the time.')
    ]
  },
  30: {
    title: "Revision finale: je peux continuer",
    main: 'final mixed review',
    review: 'personalized weak points and cumulative CLB tasks',
    newLabel: 'minimal new language, final review, confidence, and next-step planning',
    goal: 'complete final mixed reading, listening, writing, vocabulary, and grammar review using the whole course.',
    grammarRows: [
      ['final review', 'combine learned tools', 'Je lis le texte, puis je resume.'],
      ['past + future', 'before and next step', 'Hier, j ai revise; demain, je vais continuer.'],
      ['formal request', 'practical writing', 'Pourriez-vous confirmer mon rendez-vous ?'],
      ['evidence + opinion', 'CLB response', 'Selon le texte, puis a mon avis.'],
      ['pronoun + relative', 'track references', 'La note que je lis, je la comprends.'],
      ['next plan', 'continue after course', 'Je vais pratiquer chaque semaine.']
    ],
    watch: 'The final week is not the end of memory work. Keep reviewing through short, useful tasks.',
    reading: "Pour la revision finale, Alex ouvre le site depuis la premiere semaine. Il reconnait les salutations, les questions, les routines, les temps du passe, les opinions, les demandes polies, les pronoms et les connecteurs. Madame Dupont donne un dernier texte qui combine un avis formel, une expression canadienne, une phrase passive et une question CLB. Samira aide Alex a trouver la preuve. Marc lui rappelle de verifier les articles et les verbes. Alex ecrit finalement : Je peux comprendre l'idee principale. Je peux trouver un detail. Je peux ecrire une reponse courte. Je vais continuer a pratiquer chaque semaine.",
    readingEnglish: 'The final week reviews the whole course through one mixed CLB-style task and a realistic next-step plan.',
    listening: "Madame Dupont dit : Pour la revision finale, cherchez l'idee principale, deux details et une preuve. Alex repond : Je peux le faire. Je vais continuer a pratiquer chaque semaine.",
    writingTest: 'Final mixed writing: write 10-12 sentences. Summarize a message, give evidence, state an opinion, make a polite request, and describe your next study plan.',
    model: "Le message est un avis formel. Il explique qu'un rendez-vous est confirme. Selon le texte, le courriel est envoye par la clinique. La preuve est la phrase avec l'heure et l'adresse. Je pense que le message est clair. Pourriez-vous confirmer mon rendez-vous, s'il vous plait ? Hier, j'ai revise les connecteurs. Aujourd'hui, je peux ecrire une reponse courte. Demain, je vais pratiquer la lecture et l'ecoute. Je vais continuer chaque semaine.",
    vocab: [
      t('revision finale', 'final review', 'final review', 'La revision finale commence aujourd hui.', 'The final review begins today.'),
      t('je peux continuer', 'I can continue', 'confidence', 'Je peux continuer apres la semaine trente.', 'I can continue after week thirty.'),
      t('j ai progresse', 'I have progressed', 'confidence', 'J ai progresse avec la lecture.', 'I have progressed with reading.'),
      t('je comprends mieux', 'I understand better', 'confidence', 'Je comprends mieux les textes.', 'I understand texts better.'),
      t('je peux resumer', 'I can summarize', 'confidence', 'Je peux resumer un avis.', 'I can summarize a notice.'),
      t('je peux repondre', 'I can answer', 'confidence', 'Je peux repondre avec preuve.', 'I can answer with evidence.'),
      t('mon prochain objectif', 'my next goal', 'next steps', 'Mon prochain objectif est la pratique.', 'My next goal is practice.'),
      t('continuer a pratiquer', 'to continue practicing', 'next steps', 'Je vais continuer a pratiquer.', 'I am going to continue practicing.'),
      t('chaque semaine', 'each week', 'next steps', 'Je vais reviser chaque semaine.', 'I am going to review each week.'),
      t('un plan de revision', 'review plan', 'next steps', 'Mon plan de revision est simple.', 'My review plan is simple.'),
      t('mes points forts', 'my strengths', 'reflection', 'Mes points forts sont la lecture.', 'My strengths are reading.'),
      t('mes points faibles', 'my weak points', 'reflection', 'Mes points faibles sont les verbes.', 'My weak points are verbs.'),
      t('ameliorer', 'to improve', 'reflection', 'Je veux ameliorer mon ecriture.', 'I want to improve my writing.'),
      t('pratiquer regulierement', 'to practice regularly', 'next steps', 'Il faut pratiquer regulierement.', 'It is necessary to practice regularly.'),
      t('reussir le prochain test', 'to succeed on the next test', 'goal', 'Je veux reussir le prochain test.', 'I want to succeed on the next test.')
    ]
  }
};

const latestWeek = Math.max(...Object.keys(weeks).map(Number));

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function jsArg(s) {
  return esc(JSON.stringify(String(s || '')));
}

function nav(w) {
  const prev = w > 1 ? `<a class="secondary" href="../Week_${w - 1}/index.html">Week ${w - 1}</a>` : '';
  const next = w < latestWeek ? `<a class="secondary" href="../Week_${w + 1}/index.html">Week ${w + 1}</a>` : '';
  return `<nav class="nav"><a class="secondary" href="../index.html">Course home</a>${prev}${next}<a href="vocabulary.html">Vocabulary</a><a href="grammar.html">Grammar</a><a href="reading.html">Reading</a><a href="listening.html">Listening</a><a href="writing.html">Writing</a><a href="quiz.html">Quiz</a></nav>`;
}

function layout(title, w, body, includeAudio = true) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="wrap">
    ${nav(w)}
${body}
  </main>
${includeAudio ? '  <script src="audio.js"></script>\n' : ''}
</body>
</html>
`;
}

function activeNewLimit(w) {
  if (w === 1) return 24;
  if (w <= 8) return 18;
  if (w <= 16) return 16;
  if (w <= 24) return 14;
  return 10;
}

function supportLimit(w) {
  if (w === 1) return 75;
  if (w <= 8) return 12;
  if (w <= 16) return 10;
  if (w <= 24) return 8;
  return 6;
}

function coreWeekItems(w) {
  const cfg = weeks[w];
  if (!cfg) return [];
  return cfg.vocab.slice(0, activeNewLimit(w));
}

function spreadReviewItems(weekList, status) {
  const pools = weekList
    .filter(w => weeks[w])
    .map(w => ({ week: w, items: coreWeekItems(w) }))
    .filter(pool => pool.items.length);
  const out = [];
  const max = Math.max(0, ...pools.map(pool => pool.items.length));
  for (let i = 0; i < max; i++) {
    for (const pool of pools) {
      const item = pool.items[i];
      if (item) out.push({ ...item, topic: `${status} from Week ${pool.week}`, status });
    }
  }
  return out;
}

function buildItems(w) {
  const cfg = weeks[w];
  const core = cfg.vocab.slice(0, activeNewLimit(w));
  const support = cfg.vocab.slice(core.length, core.length + supportLimit(w));
  const items = [
    ...core.map(item => ({ ...item, status: 'new' })),
    ...support.map(item => ({ ...item, status: 'current support', topic: item.topic || 'current support' }))
  ];
  const recentWeeks = [w - 2, w - 1].filter(p => p >= 1);
  const olderWeeks = Array.from({ length: Math.max(0, w - 3) }, (_, i) => i + 1);
  const recent = spreadReviewItems(recentWeeks, 'recent review');
  const older = [
    ...spreadReviewItems(olderWeeks, 'older review'),
    ...(w >= 10 ? sharedReview.map(item => ({ ...item, status: 'older review' })) : [])
  ];
  const fillPool = [...recent, ...older];
  let i = 0;
  while (items.length < 75 && fillPool.length) {
    const src = fillPool[i % fillPool.length];
    items.push({ ...src });
    i++;
  }
  let j = 0;
  while (items.length < 75 && items.length) {
    const copy = { ...items[j % items.length] };
    if (copy.status === 'new') {
      copy.status = 'current support';
      copy.topic = copy.topic || 'current support';
    }
    items.push(copy);
    j++;
  }
  return items.slice(0, 75).map((item, idx) => ({ ...item, n: idx + 1, week: w }));
}

function wordCard(item, idx) {
  const n = item.n || idx + 1;
  const id = `v-${n}`;
  const articleLine = item.article ? `    <p><strong>Article:</strong> ${esc(item.article)}</p>\n` : '';
  return `<article class="word-card">
    <h3>${n}. ${esc(item.article ? `${item.article} ${item.french}` : item.french)} <span class="tag">${esc(item.status)}</span></h3>
${articleLine}    <p><strong>Pronunciation:</strong> ${esc(item.phonetic || 'listen and repeat')}</p>
    <p><strong>Example:</strong> ${esc(item.example)}</p>
    <div class="button-row">
      <button type="button" class="secondary" onclick="speakText(${jsArg(item.article ? `${item.article} ${item.french}` : item.french)})">Play word</button>
      <button type="button" onclick="speakText(${jsArg(item.example)})">Play sentence</button>
      <button type="button" class="secondary" onclick="toggleOne('${id}')">Reveal English</button>
    </div>
    <div id="${id}" class="reveal" hidden>
      <p><strong>Meaning:</strong> ${esc(item.english)}</p>
      <p><strong>Example meaning:</strong> ${esc(item.exampleEnglish)}</p>
      <p><strong>Tags:</strong> ${esc(item.topic)}; appears in reading; appears in writing</p>
    </div>
  </article>`;
}

function cardGrid(items, emptyText) {
  return items.length
    ? `<div class="grid-2">${items.map(wordCard).join('')}</div>`
    : `<p class="muted">${esc(emptyText)}</p>`;
}

function vocabPage(w, items) {
  const cfg = weeks[w];
  const newItems = items.filter(x => x.status === 'new');
  const support = items.filter(x => x.status === 'current support');
  const recent = items.filter(x => x.status === 'recent review');
  const older = items.filter(x => x.status === 'older review');
  const reviewCount = recent.length + older.length;
  const mixText = reviewCount
    ? `Active new load: ${newItems.length} core cards. Support/recognition: ${support.length} cards. The remaining ${reviewCount} cards are recent and older review so the page stays cumulative.`
    : `Active new load: ${newItems.length} core cards. Support/recognition: ${support.length} cards. This first page builds the bank that later weeks will recycle.`;
  const body = `
    <section class="card hero">
      <h1>Week ${w} Vocabulary</h1>
      <p><strong>New this week:</strong> ${esc(cfg.newLabel)}. <strong>Review inside examples:</strong> ${esc(cfg.review)}.</p>
      <p class="muted">${esc(mixText)}</p>
      <div class="button-row"><button type="button" class="secondary" onclick="toggleAll(true)">Show all English</button><button type="button" class="secondary" onclick="toggleAll(false)">Hide all English</button></div>
    </section>
    <section class="card">
      <h2>Random Bidirectional Drill</h2>
      <div class="button-row"><button type="button" onclick="generateRandomDrill('fr-en')">French to English</button><button type="button" onclick="generateRandomDrill('en-fr')">English to French</button><button type="button" class="secondary" onclick="revealRandomDrill()">Reveal answer</button></div>
      <div class="question"><p><strong>Prompt:</strong> <span id="drillPrompt">Choose a direction.</span></p><div id="drillAnswer" class="reveal" hidden></div></div>
    </section>
    <section class="card"><h2>New This Week</h2>${cardGrid(newItems, 'No new cards are added in this section. Use the review cards for consolidation.')}<h3>Controlled Support / Recognition</h3>${cardGrid(support, 'No extra support cards this week.')}</section>
    <section class="card"><h2>Review Words From Recent Weeks</h2>${cardGrid(recent, 'Week 1 has no previous week yet. The foundation cards above will become review in later weeks.')}</section>
    <section class="card"><h2>Older Core Words Returning This Week</h2>${cardGrid(older, 'No older review is available yet. It begins once earlier weeks exist.')}</section>
    <section class="card"><h2>Built With Words You Already Know</h2><p>${esc(cfg.reading.split('. ').slice(0, 3).join('. '))}.</p><button type="button" onclick="speakText(${jsArg(`${cfg.reading.split('. ').slice(0, 3).join('. ')}.`)})">Play review sentence chain</button></section>
    <section class="card"><h2>Mini Practice</h2><ol class="tight"><li>Reveal five new cards, then hide them and say the English meaning.</li><li>Use three review cards in one new sentence about Alex or Samira.</li><li>Run the random drill twice in each direction.</li></ol></section>
    <div class="footer-nav"><a class="button secondary" href="index.html">Week home</a><a class="button" href="grammar.html">Next: Grammar</a></div>
    <script>
      const vocab = ${JSON.stringify(items)};
      function label(i){return (i.article ? i.article + ' ' : '') + i.french}
      function generateRandomDrill(direction){const i=vocab[Math.floor(Math.random()*vocab.length)];const p=document.getElementById('drillPrompt');const a=document.getElementById('drillAnswer');a.hidden=true;if(direction==='fr-en'){p.textContent=label(i);a.innerHTML='<p><strong>English:</strong> '+i.english+'</p><p><strong>Example:</strong> '+i.example+'</p><p><strong>Example meaning:</strong> '+i.exampleEnglish+'</p>'}else{p.textContent=i.english;a.innerHTML='<p><strong>French:</strong> '+label(i)+'</p><p><strong>Example:</strong> '+i.example+'</p><p><strong>Example meaning:</strong> '+i.exampleEnglish+'</p>'}}
      function revealRandomDrill(){document.getElementById('drillAnswer').hidden=false}
      function toggleOne(id){const e=document.getElementById(id);e.hidden=!e.hidden}
      function toggleAll(show){document.querySelectorAll('.reveal').forEach(e=>e.hidden=!show)}
    </script>`;
  return layout(`Week ${w} Vocabulary`, w, body);
}

function grammarPage(w) {
  const cfg = weeks[w];
  const rows = cfg.grammarRows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
  const whyText = w === 1 ? 'This sentence starts the core pattern bank for later review.' : `This sentence combines Week ${w}'s target with older review language.`;
  const examples = cfg.vocab.slice(0, 6).map((v, i) => `<div class="word-card"><p><strong>${esc(v.example)}</strong></p><details><summary>English and why</summary><p>${esc(v.exampleEnglish)}</p><p>${esc(whyText)}</p></details></div>`).join('');
  const reviewText = w === 1
    ? 'This first week builds the memory base that later weeks will recycle inside examples, readings, listenings, writing prompts, and quizzes.'
    : 'Older grammar is not separate homework here. It appears inside the new examples, the reading, the listening, the writing prompts, and the quiz.';
  const body = `
    <section class="card hero"><h1>Week ${w} Grammar</h1><p><strong>Main target:</strong> ${esc(cfg.main)}. <strong>Review target:</strong> ${esc(cfg.review)}.</p></section>
    <section class="card"><h2>Main Grammar Target</h2><p>${esc(cfg.goal)}</p><table class="table"><tr><th>Pattern</th><th>Use</th><th>Example</th></tr>${rows}</table></section>
    <section class="card"><h2>Review Grammar Target</h2><p>${esc(reviewText)}</p><div class="notice">${esc(cfg.review)}</div></section>
    <section class="card"><h2>Pattern Ladder</h2><ol class="tight">${cfg.vocab.slice(0, 6).map(v => `<li>${esc(v.example)}</li>`).join('')}</ol><button type="button" onclick="speakText(${jsArg(cfg.vocab.slice(0, 6).map(v => v.example).join(' '))})">Play ladder</button></section>
    <section class="card"><h2>Compare And Notice</h2><div class="grid-2">${examples}</div><div class="watchout"><strong>Watch out:</strong> ${esc(cfg.watch)}</div></section>
    <section class="card"><h2>Mini Production Prompts</h2><div class="question"><p>Write one sentence about Alex using the new grammar.</p><details><summary>Model</summary><p>${esc(cfg.model.split('. ')[0])}.</p></details></div><div class="question"><p>Write one sentence about Samira that includes one older review item.</p><details><summary>Model</summary><p>${esc(cfg.model.split('. ')[1] || cfg.model.split('. ')[0])}.</p></details></div><div class="question"><p>Make one question and one answer using this week plus review.</p><details><summary>Model</summary><p>${esc(cfg.listening.split('. ')[0])}.</p></details></div></section>
    <div class="footer-nav"><a class="button secondary" href="vocabulary.html">Vocabulary</a><a class="button" href="reading.html">Next: Reading</a></div>`;
  return layout(`Week ${w} Grammar`, w, body);
}

function readingPage(w, items) {
  const cfg = weeks[w];
  const reviewItems = items.filter(x => x.status === 'recent review' || x.status === 'older review');
  const warmItems = (reviewItems.length ? reviewItems : items).slice(0, 2);
  const warmExamples = [...warmItems.map(x => x.example), cfg.vocab[0].example].filter(Boolean);
  const old = reviewItems.length ? reviewItems.slice(0, 12).map(x => x.french).join(', ') : 'foundation week: these words become review next week';
  const newWords = items.filter(x => x.status === 'new').slice(0, 12).map(x => x.french).join(', ');
  const sentences = cfg.reading.split(/(?<=\.)\s+/).filter(Boolean);
  const breakdown = sentences.map(s => `<li>${esc(s)} <details><summary>Meaning</summary><p>${esc(cfg.readingEnglish)}</p></details></li>`).join('');
  const body = `
    <section class="card hero"><h1>Week ${w} Reading</h1><p>This passage uses mostly learned language while adding ${esc(cfg.newLabel)}.</p></section>
    <section class="card"><h2>Warm-Up Review</h2><ol class="tight">${warmExamples.map(ex => `<li>${esc(ex)}</li>`).join('')}</ol><button type="button" onclick="speakText(${jsArg(warmExamples.join(' '))})">Play warm-up</button></section>
    <section class="card"><h2>Main Reading Passage</h2><p id="readingPassage" data-text="${esc(cfg.reading)}">${esc(cfg.reading)}</p></section>
    <section class="card"><h2>Audio Player</h2><div class="button-row"><button type="button" onclick="playPassage('readingPassage')">Play passage</button><button type="button" class="secondary" onclick="stopSpeech()">Pause / stop</button><button type="button" class="secondary" onclick="restartSpeech('readingPassage')">Restart</button></div></section>
    <section class="card"><h2>Sentence-By-Sentence Breakdown</h2><ol class="tight">${breakdown}</ol></section>
    <section class="card"><h2>Hidden English Translation</h2><details><summary>Reveal translation</summary><p>${esc(cfg.readingEnglish)}</p></details></section>
    <section class="card"><h2>Comprehension Questions</h2>${['Who is the main person in the passage?', 'Find one sentence with this week grammar.', 'Find one older review word.', 'What is one place mentioned?', 'What action or description is most important?'].map((q, i) => `<div class="question"><p>${i + 1}. ${q}</p><details><summary>Show answer</summary><p>Use the passage evidence. One possible clue: ${esc(sentences[Math.min(i, sentences.length - 1)])}</p></details></div>`).join('')}</section>
    <section class="card"><h2>Words From Earlier Weeks Used Here</h2><p>${esc(old)}</p></section>
    <section class="card"><h2>New Words In This Reading</h2><p>${esc(newWords)}</p></section>
    <div class="footer-nav"><a class="button secondary" href="grammar.html">Grammar</a><a class="button" href="listening.html">Next: Listening</a></div>`;
  return layout(`Week ${w} Reading`, w, body);
}

function listeningPage(w, items) {
  const cfg = weeks[w];
  const reviewItems = items.filter(x => x.status === 'recent review' || x.status === 'older review');
  const reviewExamples = (reviewItems.length ? reviewItems : items).slice(0, 2);
  const warmText = [cfg.vocab[0].example, ...reviewExamples.map(x => x.example)].join(' ');
  const reviewWords = reviewExamples.map(x => x.french).join(', ');
  const body = `
    <section class="card hero"><h1>Week ${w} Listening</h1><p>The listening stays close to the reading level and reuses older grammar inside the new task.</p></section>
    <section class="card"><h2>Listening Warm-Up</h2><p>${esc(warmText)}</p><button type="button" onclick="speakText(${jsArg(warmText)})">Play warm-up</button></section>
    <section class="card"><h2>Main Listening Passage</h2><p id="listeningPassage" data-text="${esc(cfg.listening)}">${esc(cfg.listening)}</p></section>
    <section class="card"><h2>Audio Player</h2><div class="button-row"><button type="button" onclick="playPassage('listeningPassage')">Play passage</button><button type="button" class="secondary" onclick="stopSpeech()">Pause / stop</button><button type="button" class="secondary" onclick="restartSpeech('listeningPassage')">Restart</button></div></section>
    <section class="card"><h2>First Listen Task</h2><p>Listen once. Identify the people, place, and main action.</p><details><summary>Answer reveal</summary><p>The passage uses Alex, Samira, Marc, or Madame Dupont in a familiar daily-life setting.</p></details></section>
    <section class="card"><h2>Second Listen Task</h2><p>Listen again. Write three words you hear from this week and two review words.</p><details><summary>Possible answers</summary><p>${esc(cfg.vocab.slice(0, 4).map(x => x.french).join(', '))}; ${esc(reviewWords || 'foundation words from this week')}</p></details></section>
    <section class="card"><h2>Dictation / Gap-Fill</h2><ol class="tight"><li>${esc(cfg.listening.split(' ').slice(0, 7).join(' '))} ___</li><li>${esc(cfg.vocab[1].example.replace(cfg.vocab[1].french, '___'))}</li><li>${esc((reviewExamples[1] || cfg.vocab[2] || cfg.vocab[0]).example.replace((reviewExamples[1] || cfg.vocab[2] || cfg.vocab[0]).french, '___'))}</li></ol><details><summary>Answer reveal</summary><p>Replay the passage and compare with the visible text above.</p></details></section>
    <section class="card"><h2>Listening Test</h2>${['What is the main situation?', 'Which new grammar pattern do you hear?', 'Which older review item returns?', 'Is the tone polite, descriptive, or narrative?'].map((q, i) => `<div class="question"><p>${i + 1}. ${q}</p><details><summary>Answer reveal</summary><p>Check the main listening passage and support your answer with one phrase.</p></details></div>`).join('')}</section>
    <section class="card"><h2>Answer Reveal</h2><details><summary>Show full listening text</summary><p>${esc(cfg.listening)}</p></details></section>
    <div class="footer-nav"><a class="button secondary" href="reading.html">Reading</a><a class="button" href="writing.html">Next: Writing</a></div>`;
  return layout(`Week ${w} Listening`, w, body);
}

function writingPage(w, items) {
  const cfg = weeks[w];
  const reviewItems = items.filter(x => x.status === 'recent review' || x.status === 'older review');
  const reviewExamples = (reviewItems.length ? reviewItems : items).slice(0, 2);
  const reviewChunks = reviewExamples.map(x => x.french).join(', ');
  const body = `
    <section class="card hero"><h1>Week ${w} Writing</h1><p>Writing moves from controlled sentence work to a short output task using this week plus older review.</p></section>
    <section class="card"><h2>Sentence Warm-Up</h2><ol class="tight"><li>Copy: ${esc(cfg.vocab[0].example)}</li><li>Change the person or object: ${esc(cfg.vocab[1].example)}</li><li>Add one review word: ${esc((reviewExamples[0] || cfg.vocab[0]).example)}</li></ol></section>
    <section class="card"><h2>Guided Writing</h2><p>Complete the frames with your own words.</p><ol class="tight"><li>Bonjour, je m'appelle ___.</li><li>${esc(cfg.vocab[0].example.split(' ').slice(0, 4).join(' '))} ___.</li><li>Avec Samira, je revise ___.</li><li>Dans ma phrase, j'utilise aussi ___.</li></ol></section>
    <section class="card"><h2>Controlled Writing</h2><p>Use these required chunks: ${esc(cfg.vocab.slice(0, 6).map(x => x.french).join(', '))}. Add two review chunks: ${esc(reviewChunks || 'two foundation chunks from this week')}.</p></section>
    <section class="card"><h2>Writing Test</h2><p>${esc(cfg.writingTest)}</p></section>
    <section class="card"><h2>Checklist Before Reveal / Submit</h2><ul class="tight"><li>I used Week ${w}'s main grammar.</li><li>I reused at least three older vocabulary items.</li><li>I checked articles, adjective agreement, or verb form where relevant.</li><li>My sentences are short enough to control.</li></ul></section>
    <section class="card"><h2>Rubric</h2><table class="table rubric"><tr><th>Area</th><th>Strong</th><th>Still building</th></tr><tr><td>Task completion</td><td>All required details included.</td><td>One or more required details missing.</td></tr><tr><td>Vocabulary use</td><td>Current and review words are used naturally.</td><td>Words are copied but not integrated yet.</td></tr><tr><td>Grammar control</td><td>Main pattern is mostly accurate.</td><td>Main pattern needs more guided practice.</td></tr><tr><td>Clarity</td><td>Short, clear, understandable sentences.</td><td>Sentences are too long or unclear.</td></tr></table></section>
    <section class="card"><h2>Model Answer Hidden By Default</h2><details><summary>Reveal model answer</summary><p>${esc(cfg.model)}</p></details></section>
    <div class="footer-nav"><a class="button secondary" href="listening.html">Listening</a><a class="button" href="quiz.html">Next: Quiz</a></div>`;
  return layout(`Week ${w} Writing`, w, body, false);
}

function quizQuestion(q, idx) {
  const name = `q${idx + 1}`;
  const opts = q.options.map(o => `<label><input type="radio" name="${name}" value="${esc(o)}"> ${esc(o)}</label>`).join('<br>');
  return `<div class="quiz-question" data-answer="${esc(q.answer)}" data-explain="${esc(q.explain)}" data-scope="${esc(q.scope)}"><p><strong>${idx + 1}.</strong> <span class="tag">${esc(q.scope)}</span> ${esc(q.prompt)}</p>${opts}<div class="feedback"></div></div>`;
}

function optionSet(answer, extras = []) {
  const fallback = [
    'a main idea',
    'a specific detail',
    'a polite request',
    'a past action',
    'a place or time marker',
    'an older review word'
  ];
  const out = [];
  for (const value of [answer, ...extras, ...fallback]) {
    if (value && !out.includes(value)) out.push(value);
    if (out.length === 4) break;
  }
  return out;
}

function labelFor(item) {
  return item.article ? `${item.article} ${item.french}` : item.french;
}

function quizPage(w, items) {
  const cfg = weeks[w];
  const qs = [];
  const currentItems = items.filter(x => x.status === 'new');
  const reviewItems = items.filter(x => x.status !== 'new');
  for (const item of currentItems.slice(0, 14)) {
    qs.push({
      scope: 'current week',
      prompt: `In the sentence "${item.example}", what does "${labelFor(item)}" mean?`,
      answer: item.english,
      options: optionSet(item.english, reviewItems.slice(0, 3).map(x => x.english)),
      explain: item.exampleEnglish
    });
  }
  for (const row of cfg.grammarRows.slice(0, 8)) {
    qs.push({
      scope: 'current grammar',
      prompt: `Which sentence matches the pattern "${row[0]}" in context?`,
      answer: row[2],
      options: optionSet(row[2], [cfg.vocab[0].example, (reviewItems[0] || cfg.vocab[1]).example, cfg.model.split('. ')[0]]),
      explain: `${row[1]}. Pattern: ${row[0]}`
    });
  }
  for (const item of reviewItems.slice(0, 16)) {
    qs.push({
      scope: item.status === 'current support' ? 'current support' : 'review',
      prompt: `Review in context: "${item.example}" What is the key meaning of "${labelFor(item)}"?`,
      answer: item.english,
      options: optionSet(item.english, currentItems.slice(0, 3).map(x => x.english)),
      explain: item.exampleEnglish
    });
  }
  const checks = [
    ['Task sentence: "Selon le texte, trouve la preuve." What should you find?', 'the evidence in the text'],
    ['Listening sentence: "Ecoute deux fois, puis note deux details." What should you identify first?', 'people, place, and main action'],
    ['Writing instruction: "Ecris des phrases courtes et claires." What should your sentences be?', 'short enough to control'],
    ['Quiz instruction: "Melange la semaine actuelle et la revision." What does the quiz mix include?', 'current week and review'],
    ['Feedback instruction: "Relis l explication et reessaie." What should you do after an error?', 'read the explanation and retry']
  ];
  for (const [prompt, answer] of checks) {
    qs.push({
      scope: 'reading/listening/writing',
      prompt,
      answer,
      options: optionSet(answer, ['only isolated word recall', 'skip the review', 'use unlearned grammar freely']),
      explain: 'This course uses cumulative CLB-style practice.'
    });
  }
  while (qs.length < 50) {
    const item = items[qs.length % items.length];
    qs.push({
      scope: item.status === 'new' ? 'current week' : 'cumulative review',
      prompt: `Choose the sentence that correctly uses "${labelFor(item)}" in context.`,
      answer: item.example,
      options: optionSet(item.example, [`${labelFor(item)}. ${labelFor(item)}.`, 'Nous sommes un rouge table.', "J'ai est dans le bus."]),
      explain: item.exampleEnglish
    });
  }
  const finalQs = qs.slice(0, 50);
  const body = `
    <section class="card hero"><h1>Week ${w} Quiz</h1><p>50 questions. Immediate feedback. Current week content is mixed with recent and older review.</p></section>
    <form id="mainQuiz">
      <section class="card"><h2>Quick Review Quiz</h2>${finalQs.slice(0, 8).map(quizQuestion).join('')}</section>
      <section class="card"><h2>Main Weekly Quiz</h2>${finalQs.slice(8, 30).map((q, i) => quizQuestion(q, i + 8)).join('')}</section>
      <section class="card"><h2>Reading / Listening Mini Checks</h2>${finalQs.slice(30, 38).map((q, i) => quizQuestion(q, i + 30)).join('')}</section>
      <section class="card"><h2>Cumulative Review Block</h2>${finalQs.slice(38, 50).map((q, i) => quizQuestion(q, i + 38)).join('')}</section>
    </form>
    <section class="card"><h2>Final Score</h2><div class="button-row"><button type="button" onclick="gradeQuiz('mainQuiz','quizResult')">Check all answers</button><button type="button" class="secondary" onclick="resetQuiz('mainQuiz','quizResult')">Retry</button></div><div id="quizResult" class="score" hidden></div></section>
    <div class="footer-nav"><a class="button secondary" href="writing.html">Writing</a><a class="button" href="index.html">Back to Week ${w} home</a></div>`;
  return layout(`Week ${w} Quiz`, w, body);
}

function weekIndex(w, items) {
  const cfg = weeks[w];
  const prev = w > 1 ? `<a class="button secondary" href="../Week_${w - 1}/index.html">Previous Week</a>` : '';
  const next = w < latestWeek ? `<a class="button secondary" href="../Week_${w + 1}/index.html">Next Week</a>` : '';
  const reviewItems = items.filter(x => x.status === 'recent review' || x.status === 'older review');
  const reviewText = [cfg.vocab[0].example, ...(reviewItems.length ? reviewItems.slice(0, 2) : cfg.vocab.slice(1, 3)).map(x => x.example)].join(' ');
  const body = `
    <section class="card hero">
      <h1>Week ${w} - ${esc(cfg.title)}</h1>
      <p><strong>What is new:</strong> ${esc(cfg.newLabel)}.</p>
      <p><strong>What is being reviewed:</strong> ${esc(cfg.review)}.</p>
      <p><strong>Learning goals:</strong> ${esc(cfg.goal)}</p>
      <div class="progress"><div class="bar" style="width:${(w / 30 * 100).toFixed(1)}%"></div></div>
    </section>
    <section class="card"><h2>Suggested Study Order</h2><ol class="tight"><li>Vocabulary</li><li>Grammar</li><li>Reading</li><li>Listening</li><li>Writing</li><li>Quiz</li></ol><div class="button-row"><a class="button" href="vocabulary.html">Start Vocabulary</a><a class="button secondary" href="quiz.html">Open Quiz</a></div></section>
    <section class="card"><h2>Review Is Built In</h2><p>${esc(reviewText)}</p></section>
    <section class="card"><h2>Section Map</h2><div class="grid-3"><a class="button secondary" href="vocabulary.html">Vocabulary</a><a class="button secondary" href="grammar.html">Grammar</a><a class="button secondary" href="reading.html">Reading</a><a class="button secondary" href="listening.html">Listening</a><a class="button secondary" href="writing.html">Writing</a><a class="button secondary" href="quiz.html">Quiz</a></div></section>
    <div class="footer-nav">${prev}<a class="button" href="../index.html">Course Home</a>${next}</div>`;
  return layout(`Week ${w} - ${cfg.title}`, w, body);
}

const css = `:root{--bg:#f7f8fc;--card:#fff;--ink:#1f2937;--muted:#5f6b7a;--line:#dbe2ea;--accent:#1d4ed8;--accent-soft:#dbeafe;--ok:#166534;--bad:#991b1b;--warn:#92400e}*{box-sizing:border-box}body{margin:0;font-family:Arial,Helvetica,sans-serif;background:var(--bg);color:var(--ink);line-height:1.55}.wrap{max-width:1040px;margin:0 auto;padding:16px}.card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:18px;margin:0 0 16px;box-shadow:0 2px 10px rgba(15,23,42,.04)}.hero{background:#fff}h1,h2,h3{line-height:1.25;margin:0 0 12px;letter-spacing:0}p,li{font-size:1rem}.muted{color:var(--muted)}.nav,.button-row,.footer-nav{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.nav{margin:0 0 16px}.footer-nav{justify-content:space-between}.button,button,.nav a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 14px;border-radius:8px;border:1px solid var(--accent);background:var(--accent);color:#fff;text-decoration:none;font-weight:700;cursor:pointer;font-size:1rem}.secondary,button.secondary,.nav a.secondary{background:#fff;color:var(--accent);border-color:var(--line)}.tag{display:inline-block;padding:3px 7px;border-radius:999px;background:var(--accent-soft);color:#1e3a8a;font-size:.78rem;font-weight:700;margin:2px 4px 2px 0}.grid-2{display:grid;grid-template-columns:1fr;gap:12px}.grid-3{display:grid;grid-template-columns:1fr;gap:10px}.word-card,.question{border:1px solid var(--line);border-radius:8px;padding:12px;background:#fff}.reveal,.notice{border-left:4px solid var(--accent);padding:10px 12px;background:#eff6ff;margin-top:10px}.watchout{border-left:4px solid var(--warn);padding:10px 12px;background:#fffbeb;margin-top:12px}.feedback{margin-top:8px;font-weight:700}.feedback.ok{color:var(--ok)}.feedback.bad{color:var(--bad)}.score{font-size:1.1rem;font-weight:700;padding:12px;border-radius:8px;background:#f1f5f9;margin-top:12px}.progress{width:100%;height:12px;background:#e5e7eb;border-radius:999px;overflow:hidden}.bar{height:100%;background:linear-gradient(90deg,#1d4ed8,#38bdf8)}.table{width:100%;border-collapse:collapse;overflow:auto}.table th,.table td{border:1px solid var(--line);padding:10px;text-align:left;vertical-align:top}.tight{margin-top:0}.quiz-question{border:1px solid var(--line);border-radius:8px;padding:12px;margin:0 0 12px;background:#fff}.rubric td,.rubric th{font-size:.95rem}@media (min-width:720px){.grid-2{grid-template-columns:1fr 1fr}.grid-3{grid-template-columns:repeat(3,1fr)}}@media (max-width:520px){.wrap{padding:12px}.button,button,.nav a{width:100%}.footer-nav{display:block}.footer-nav .button{margin-bottom:10px}}`;

const audio = `let currentUtterance=null;function stopSpeech(){if('speechSynthesis'in window){window.speechSynthesis.cancel()}currentUtterance=null}function speakText(text){stopSpeech();if(!('speechSynthesis'in window)){return}const utterance=new SpeechSynthesisUtterance(String(text||''));utterance.lang='fr-FR';utterance.rate=.82;currentUtterance=utterance;window.speechSynthesis.speak(utterance)}function playPassage(id){const el=document.getElementById(id);if(el){speakText(el.dataset.text||el.textContent)}}function restartSpeech(id){stopSpeech();playPassage(id)}function gradeQuiz(formId,resultId){const form=document.getElementById(formId);const questions=[...form.querySelectorAll('.quiz-question')];let score=0;questions.forEach(q=>{const answer=q.dataset.answer;const checked=q.querySelector('input[type="radio"]:checked');const feedback=q.querySelector('.feedback');const ok=checked&&checked.value===answer;if(ok)score++;feedback.className='feedback '+(ok?'ok':'bad');feedback.textContent=(ok?'Correct. ':'Review: ')+q.dataset.explain});const result=document.getElementById(resultId);result.hidden=false;result.textContent='Score: '+score+' / '+questions.length}function resetQuiz(formId,resultId){const form=document.getElementById(formId);form.reset();form.querySelectorAll('.feedback').forEach(f=>{f.textContent='';f.className='feedback'});const result=document.getElementById(resultId);if(result)result.hidden=true}`;

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

const allItems = {};
for (const w of Object.keys(weeks).map(Number)) {
  const items = buildItems(w);
  allItems[w] = items;
  const dir = path.join(root, `Week_${w}`);
  write(path.join(dir, 'index.html'), weekIndex(w, items));
  write(path.join(dir, 'vocabulary.html'), vocabPage(w, items));
  write(path.join(dir, 'grammar.html'), grammarPage(w));
  write(path.join(dir, 'reading.html'), readingPage(w, items));
  write(path.join(dir, 'listening.html'), listeningPage(w, items));
  write(path.join(dir, 'writing.html'), writingPage(w, items));
  write(path.join(dir, 'quiz.html'), quizPage(w, items));
  write(path.join(dir, 'styles.css'), css);
  write(path.join(dir, 'audio.js'), audio);
  const activeCount = items.filter(item => item.status === 'new').length;
  const supportCount = items.filter(item => item.status === 'current support').length;
  write(path.join(root, `week-${String(w).padStart(2, '0')}-summary.md`), `# Week-${String(w).padStart(2, '0')} Summary\n\n- Main grammar: ${weeks[w].main}.\n- Review grammar: ${weeks[w].review}.\n- Vocabulary count: 75 practice items (${activeCount} active new cards, ${supportCount} current support cards, and cumulative review).\n- Quiz: 50 sentence-based questions with current, recent review, reading/listening checks, and cumulative review.\n- Embedded review: older vocabulary and grammar appear inside vocabulary examples, grammar examples, reading, listening, writing prompts, and quiz sentences.\n- Story continuity: Alex, Samira, Marc, Madame Dupont, the cafe, class, apartment, bus, and neighborhood routines return.\n`);
}

const rootIndexCards = Object.entries(weeks)
  .sort(([a], [b]) => Number(a) - Number(b))
  .map(([w, cfg]) => `<article class="card"><h2>Week ${w} - ${esc(cfg.title)}</h2><span class="tag ${Number(w) < latestWeek ? 'done' : ''}">${Number(w) < latestWeek ? 'completed' : 'current'}</span><span class="tag">75 practice items</span><span class="tag">${activeNewLimit(Number(w))} active new</span><p>${esc(cfg.newLabel)}. Review: ${esc(cfg.review)}.</p><div class="button-row"><a class="button" href="Week_${w}/index.html">Open Week ${w}</a><a class="button secondary" href="Week_${w}/quiz.html">Week ${w} Quiz</a></div></article>`)
  .join('\n');
write(path.join(root, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>French Course Home</title>
  <style>${css}</style>
</head>
<body>
  <main class="wrap">
    <section class="card hero">
      <h1>French Course</h1>
      <p>A cumulative French course for CLB 7 preparation, moving from foundations to CLB-style reading, listening, writing, inference, summary, evidence, and formal-message tasks.</p>
      <p class="muted">Current progress: Week ${latestWeek} generated out of 30 planned weeks. Week ${latestWeek} is current; Weeks 1-${latestWeek - 1} are completed.</p>
      <div class="progress" aria-label="course progress"><div class="bar" style="width:${(latestWeek / 30 * 100).toFixed(1)}%"></div></div>
    </section>
    <section class="grid-2">
      ${rootIndexCards}
    </section>
    <section class="card"><h2>${latestWeek >= 30 ? 'Course Complete' : 'Coming Next'}</h2><p>${latestWeek >= 30 ? 'All 30 planned weeks are generated. Continue with cumulative review, mock tasks, and targeted weak points.' : `Week ${latestWeek + 1} will continue the planned CLB spiral with new content plus cumulative review.`}</p></section>
  </main>
</body>
</html>
`);

const originalCsv = fs.readFileSync(path.join(root, 'vocabulary_bank.csv'), 'utf8').split(/\r?\n/).filter(Boolean);
const header = originalCsv[0];
function csvCell(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
let id = 1;
const generatedRows = [];
for (const w of Object.keys(allItems).map(Number).sort((a, b) => a - b)) {
  for (const item of allItems[w]) {
    generatedRows.push([
      `W${String(id).padStart(4, '0')}`,
      item.french,
      item.article || '',
      item.english,
      item.phonetic || 'listen and repeat',
      w,
      item.topic || '',
      'active',
      'yes',
      'yes',
      'yes',
      item.example,
      item.exampleEnglish,
      `${item.status}; Week ${w} cumulative practice item ${item.n}`
    ].map(csvCell).join(','));
    id++;
  }
}
write(path.join(root, 'vocabulary_bank.csv'), [header, ...generatedRows].join('\n') + '\n');

write(path.join(root, 'learner_state.md'), `# Learner State

## Current course status
- Current week: 30
- Completed weeks: week 1, week 2, week 3, week 4, week 5, week 6, week 7, week 8, week 9, week 10, week 11, week 12, week 13, week 14, week 15, week 16, week 17, week 18, week 19, week 20, week 21, week 22, week 23, week 24, week 25, week 26, week 27, week 28, week 29
- Last generated week: week 30

## Skill focus
- Primary goals: reading, listening, writing
- Speaking practice: external tutor
- Current overall level estimate: 30-week CLB 7 preparation path completed for reading, listening, and writing; continue with timed mock tasks, error repair, and outside speaking practice before the exam

## Strong areas
- recognizes greetings, etre, avoir, articles, common noun/adjective patterns, possessives, partitives, question forms, place expressions, reflexive routines, weather/time, present-tense work/study verbs, passe compose chunks, imperfect background/habit chunks, health/necessity chunks, opinions, futur proche plans, polite conditional requests, basic object pronouns, relative clauses, Canadian French recognition items, subjunctive-awareness chunks, passive voice basics, connectors, register differences, news/report language, inference strategies, mock-test routines, and final CLB review language
- can study current pages while automatically reviewing previous vocabulary inside examples, readings, listenings, writing prompts, and quizzes
- has recurring story anchors with Alex, Samira, Marc, Madame Dupont, the cafe, class, apartment, bus, park, and neighborhood

## Weak areas
- timed free production still needs regular mock practice and correction cycles
- adjective agreement, possessives, partitives, and question forms need ongoing contrast
- complex grammar integration, timed writing, inference, pronoun tracking, and formal summary-response writing need ongoing targeted review after the course
- numbers above ten need continued practical use through prices, times, dates, and quantities

## High-priority review items
- etre and avoir forms
- articles: un / une / le / la / les / des
- adjective agreement: petit/petite, grand/grande, colors
- possessives: mon / ma / mes, son / sa / ses, notre / nos
- partitives: du / de la / de l' / des, pas de
- question forms: est-ce que, qu'est-ce que, ou, combien, quand, qui, pourquoi, comment
- vouloir / prendre: je veux, vous voulez, je prends, vous prenez
- il y a + place words
- reflexives: je me leve, je me prepare, elle se couche
- weather/time: il pleut, il fait froid, aujourd'hui, demain, hier
- passe compose: j'ai travaille, j'ai pris, j'ai mange, j'ai ecrit
- imperfect contrast: avant, j'etais, j'avais, j'habitais, je jouais, il pleuvait
- health needs: il faut, je dois, vous devez, j'ai mal a la tete, j'ai besoin de repos
- opinions: je pense que, j'aime, je prefere, parce que
- future plans: je vais, tu vas, elle va, nous allons
- polite requests: je voudrais, pourriez-vous, est-ce que je pourrais
- pronouns: le, la, les, lui before the verb
- relative clauses: qui, que, dont
- Canadian French recognition: courriel, magasinage, char, cellulaire, depanneur
- subjunctive-awareness: il faut que, je veux que, je suis content que, je recommande que
- passive voice: est ecrit, est envoye, est donne, est explique
- connectors: cependant, donc, pourtant, pendant que, grace a, d'une part / d'autre part
- formal register: je vous ecris pour, pourriez-vous, cordialement
- CLB strategy: idee principale, preuve, selon le texte, resume, detail precis
- news/report: une nouvelle, un rapport, le service, l evenement, la consequence
- inference: deduire, indice, renvoyer a, preuve textuelle, probable
- mock/final: test blanc, temps limite, relire, corriger, revision finale

## Grammar status
- etre: introduced; active review
- avoir: introduced; active review
- articles/gender: introduced; active review
- adjective agreement: introduced; active review
- possessives: introduced; active review
- partitive basics: introduced; active review
- polite requests: introduced with je voudrais; active review
- question forms: introduced; active review
- vouloir / prendre basics: introduced; active review
- il y a / place expressions: introduced formally in Week 8
- reflexive verbs: introduced in Week 9
- weather/time expressions: introduced in Week 10
- regular present-tense consolidation: introduced in Week 11
- passe compose: introduced in Week 12 with avoir + past participle
- imperfect: introduced in Week 13 for background, habits, and scene-setting, contrasted with passe compose
- necessity / obligation chunks: introduced in Week 14 with il faut, devoir, avoir mal a, and avoir besoin de
- opinions and preferences: introduced in Week 15
- futur proche: introduced in Week 16
- conditional for politeness: introduced in Week 17 as memorized request chunks
- direct and indirect pronouns: introduced in Week 18 in staged recognition and controlled production
- relative clauses: introduced in Week 19 with qui, que, and recognition of dont
- Canadian French recognition: introduced in Week 20
- subjunctive awareness: introduced in Week 21 through common chunks only
- passive voice basics: introduced in Week 22 for recognition and active/passive transformations
- complex connectors: introduced in Week 23 for linked paragraphs
- formal vs informal register: introduced in Week 24
- CLB strategy training: introduced in Week 25 with no major new grammar
- news style review: introduced in Week 26
- formal complex sentence control: introduced in Week 27
- inference and discourse tracking: introduced in Week 28
- mock CLB-style practice: introduced in Week 29
- final mixed review: introduced in Week 30
- future forms: futur proche introduced; simple future not introduced

## Vocabulary tracking
### Ordered vocabulary bank status
- Weeks 1-30 each have 75 numbered practice items.
- vocabulary_bank.csv tracks 2250 entries total, with 75 entries per week.
- Each week contains a controlled active new load, a small current support set, and recent plus older cumulative review.
- Vocabulary pages include random bidirectional drills for French to English and English to French recall.
- Future weeks must embed previous-week content directly inside new examples, passages, writing prompts, and quizzes.

### Active review vocabulary
- family and possessives from Week 5
- food, drinks, partitives, and cafe requests from Week 6
- shopping, question forms, vouloir, prendre from Week 7
- il y a, town places, transport, and directions from Week 8
- daily routine and reflexive verbs from Week 9
- weather, seasons, and time markers from Week 10
- work/study and regular present-tense verbs from Week 11
- passe compose chunks from Week 12
- imperfect background and habit chunks from Week 13
- health, body, symptoms, and advice chunks from Week 14
- opinions and preferences from Week 15
- future plans and appointment language from Week 16
- polite requests and service language from Week 17
- object pronouns from Week 18
- relative clauses from Week 19
- Canadian French recognition from Week 20
- subjunctive-awareness and recommendation chunks from Week 21
- passive/process language from Week 22
- complex connectors from Week 23
- formal and informal register from Week 24
- CLB instruction, question stem, and strategy language from Week 25
- news style and public-topic language from Week 26
- formal report and professional message language from Week 27
- inference and discourse tracking language from Week 28
- mock CLB timing/checking language from Week 29
- final review, confidence, and next-step planning language from Week 30

### New vocabulary from latest week
- revision finale / je peux continuer / j ai progresse / je comprends mieux
- je peux resumer / je peux repondre / mon prochain objectif / continuer a pratiquer
- chaque semaine / un plan de revision / mes points forts / mes points faibles
- ameliorer / pratiquer regulierement / reussir le prochain test

## Writing notes
- Writing comfort: guided CLB 7 preparation, strongest with short planning and checklist use
- Current writing target: final mixed CLB-style response using summary, evidence, opinion, polite request, and next study plan
- Current writing success target: guided 10-12 sentence final response with controlled grammar and explicit evidence

## Listening notes
- Listening comfort: CLB 7 preparation, strongest with two-listen strategy and note-taking
- Current listening target: final mixed listening review across familiar classroom, clinic, service, and CLB instruction contexts
- Current listening success target: identify speaker, purpose, main idea, two details, one pronoun reference, and one next step

## Reading notes
- Reading comfort: CLB 7 preparation, strongest with main-idea, detail, inference, and evidence tasks
- Current reading target: final mixed CLB-style review with notices, emails, news, reports, inference, and evidence
- Current reading success target: identify task type, main idea, details, evidence, register, and one inference with support

## Personal preferences
- Wants progression and continuity
- Wants revision so words do not feel random
- Wants phonetic support
- Wants hidden English reveal
- Wants writing tests in addition to reading/listening
- Wants listening tests based on learned content
`);
