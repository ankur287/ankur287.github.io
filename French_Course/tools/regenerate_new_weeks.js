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

const weeks = {
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
  }
};

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function nav(w) {
  const prev = w > 1 ? `<a class="secondary" href="../Week_${w - 1}/index.html">Week ${w - 1}</a>` : '';
  const next = w < 12 ? `<a class="secondary" href="../Week_${w + 1}/index.html">Week ${w + 1}</a>` : '';
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
  ${includeAudio ? '<script src="audio.js"></script>' : ''}
</body>
</html>
`;
}

function buildItems(w) {
  const cfg = weeks[w];
  const items = [];
  for (const item of cfg.vocab) items.push({ ...item, status: 'new' });
  const recent = [];
  for (let p = Math.max(3, w - 2); p < w; p++) {
    if (weeks[p]) recent.push(...weeks[p].vocab.slice(0, 10).map(x => ({ ...x, topic: `review from Week ${p}`, status: 'recent review' })));
  }
  if (!recent.length) {
    recent.push(...sharedReview.map(x => ({ ...x, topic: 'review from Weeks 1-2', status: 'recent review' })));
  }
  const older = sharedReview.map(x => ({ ...x, status: 'older review' }));
  let pool = [...recent, ...older];
  let i = 0;
  while (items.length < 75) {
    const src = pool[i % pool.length];
    items.push({ ...src, topic: src.topic || 'review', status: src.status || 'review' });
    i++;
  }
  return items.slice(0, 75).map((item, idx) => ({ ...item, n: idx + 1, week: w }));
}

function wordCard(item, idx) {
  const id = `v-${idx + 1}`;
  return `<article class="word-card">
    <h3>${idx + 1}. ${esc(item.article ? `${item.article} ${item.french}` : item.french)} <span class="tag">${esc(item.status)}</span></h3>
    ${item.article ? `<p><strong>Article:</strong> ${esc(item.article)}</p>` : ''}
    <p><strong>Pronunciation:</strong> ${esc(item.phonetic || 'listen and repeat')}</p>
    <p><strong>Example:</strong> ${esc(item.example)}</p>
    <div class="button-row">
      <button type="button" class="secondary" onclick="speakText('${esc(item.article ? `${item.article} ${item.french}` : item.french)}')">Play word</button>
      <button type="button" onclick="speakText('${esc(item.example)}')">Play sentence</button>
      <button type="button" class="secondary" onclick="toggleOne('${id}')">Reveal English</button>
    </div>
    <div id="${id}" class="reveal" hidden>
      <p><strong>Meaning:</strong> ${esc(item.english)}</p>
      <p><strong>Example meaning:</strong> ${esc(item.exampleEnglish)}</p>
      <p><strong>Tags:</strong> ${esc(item.topic)}; appears in reading; appears in writing</p>
    </div>
  </article>`;
}

function vocabPage(w, items) {
  const cfg = weeks[w];
  const newItems = items.filter(x => x.status === 'new');
  const recent = items.filter(x => x.status === 'recent review');
  const older = items.filter(x => x.status === 'older review');
  const body = `
    <section class="card hero">
      <h1>Week ${w} Vocabulary</h1>
      <p><strong>New this week:</strong> ${esc(cfg.newLabel)}. <strong>Review inside examples:</strong> ${esc(cfg.review)}.</p>
      <div class="button-row"><button type="button" class="secondary" onclick="toggleAll(true)">Show all English</button><button type="button" class="secondary" onclick="toggleAll(false)">Hide all English</button></div>
    </section>
    <section class="card">
      <h2>Random Bidirectional Drill</h2>
      <div class="button-row"><button type="button" onclick="generateRandomDrill('fr-en')">French to English</button><button type="button" onclick="generateRandomDrill('en-fr')">English to French</button><button type="button" class="secondary" onclick="revealRandomDrill()">Reveal answer</button></div>
      <div class="question"><p><strong>Prompt:</strong> <span id="drillPrompt">Choose a direction.</span></p><div id="drillAnswer" class="reveal" hidden></div></div>
    </section>
    <section class="card"><h2>New This Week</h2><div class="grid-2">${newItems.map(wordCard).join('')}</div></section>
    <section class="card"><h2>Review Words From Recent Weeks</h2><div class="grid-2">${recent.slice(0, 24).map(wordCard).join('')}</div></section>
    <section class="card"><h2>Older Core Words Returning This Week</h2><div class="grid-2">${older.slice(0, 18).map(wordCard).join('')}</div></section>
    <section class="card"><h2>Built With Words You Already Know</h2><p>${esc(cfg.reading.split('. ').slice(0, 3).join('. '))}.</p><button type="button" onclick="speakText('${esc(cfg.reading.split('. ').slice(0, 3).join('. '))}.')">Play review sentence chain</button></section>
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
  const examples = cfg.vocab.slice(0, 6).map((v, i) => `<div class="word-card"><p><strong>${esc(v.example)}</strong></p><details><summary>English and why</summary><p>${esc(v.exampleEnglish)}</p><p>This sentence combines Week ${w}'s target with older review language.</p></details></div>`).join('');
  const body = `
    <section class="card hero"><h1>Week ${w} Grammar</h1><p><strong>Main target:</strong> ${esc(cfg.main)}. <strong>Review target:</strong> ${esc(cfg.review)}.</p></section>
    <section class="card"><h2>Main Grammar Target</h2><p>${esc(cfg.goal)}</p><table class="table"><tr><th>Pattern</th><th>Use</th><th>Example</th></tr>${rows}</table></section>
    <section class="card"><h2>Review Grammar Target</h2><p>Older grammar is not separate homework here. It appears inside the new examples, the reading, the listening, the writing prompts, and the quiz.</p><div class="notice">${esc(cfg.review)}</div></section>
    <section class="card"><h2>Pattern Ladder</h2><ol class="tight">${cfg.vocab.slice(0, 6).map(v => `<li>${esc(v.example)}</li>`).join('')}</ol><button type="button" onclick="speakText('${esc(cfg.vocab.slice(0, 6).map(v => v.example).join(' '))}')">Play ladder</button></section>
    <section class="card"><h2>Compare And Notice</h2><div class="grid-2">${examples}</div><div class="watchout"><strong>Watch out:</strong> ${esc(cfg.watch)}</div></section>
    <section class="card"><h2>Mini Production Prompts</h2><div class="question"><p>Write one sentence about Alex using the new grammar.</p><details><summary>Model</summary><p>${esc(cfg.model.split('. ')[0])}.</p></details></div><div class="question"><p>Write one sentence about Samira that includes one older review item.</p><details><summary>Model</summary><p>${esc(cfg.model.split('. ')[1] || cfg.model.split('. ')[0])}.</p></details></div><div class="question"><p>Make one question and one answer using this week plus review.</p><details><summary>Model</summary><p>${esc(cfg.listening.split('. ')[0])}.</p></details></div></section>
    <div class="footer-nav"><a class="button secondary" href="vocabulary.html">Vocabulary</a><a class="button" href="reading.html">Next: Reading</a></div>`;
  return layout(`Week ${w} Grammar`, w, body);
}

function readingPage(w) {
  const cfg = weeks[w];
  const old = sharedReview.slice(0, 6).map(x => x.french).join(', ');
  const newWords = cfg.vocab.slice(0, 10).map(x => x.french).join(', ');
  const sentences = cfg.reading.split(/(?<=\.)\s+/).filter(Boolean);
  const breakdown = sentences.map(s => `<li>${esc(s)} <details><summary>Meaning</summary><p>${esc(cfg.readingEnglish)}</p></details></li>`).join('');
  const body = `
    <section class="card hero"><h1>Week ${w} Reading</h1><p>This passage uses mostly learned language while adding ${esc(cfg.newLabel)}.</p></section>
    <section class="card"><h2>Warm-Up Review</h2><ol class="tight"><li>${esc(sharedReview[0].example)}</li><li>${esc(sharedReview[1].example)}</li><li>${esc(cfg.vocab[0].example)}</li></ol><button type="button" onclick="speakText('${esc([sharedReview[0].example, sharedReview[1].example, cfg.vocab[0].example].join(' '))}')">Play warm-up</button></section>
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

function listeningPage(w) {
  const cfg = weeks[w];
  const body = `
    <section class="card hero"><h1>Week ${w} Listening</h1><p>The listening stays close to the reading level and reuses older grammar inside the new task.</p></section>
    <section class="card"><h2>Listening Warm-Up</h2><p>${esc(cfg.vocab[0].example)} ${esc(sharedReview[0].example)}</p><button type="button" onclick="speakText('${esc(cfg.vocab[0].example + ' ' + sharedReview[0].example)}')">Play warm-up</button></section>
    <section class="card"><h2>Main Listening Passage</h2><p id="listeningPassage" data-text="${esc(cfg.listening)}">${esc(cfg.listening)}</p></section>
    <section class="card"><h2>Audio Player</h2><div class="button-row"><button type="button" onclick="playPassage('listeningPassage')">Play passage</button><button type="button" class="secondary" onclick="stopSpeech()">Pause / stop</button><button type="button" class="secondary" onclick="restartSpeech('listeningPassage')">Restart</button></div></section>
    <section class="card"><h2>First Listen Task</h2><p>Listen once. Identify the people, place, and main action.</p><details><summary>Answer reveal</summary><p>The passage uses Alex, Samira, Marc, or Madame Dupont in a familiar daily-life setting.</p></details></section>
    <section class="card"><h2>Second Listen Task</h2><p>Listen again. Write three words you hear from this week and two review words.</p><details><summary>Possible answers</summary><p>${esc(cfg.vocab.slice(0, 4).map(x => x.french).join(', '))}; ${esc(sharedReview.slice(0, 2).map(x => x.french).join(', '))}</p></details></section>
    <section class="card"><h2>Dictation / Gap-Fill</h2><ol class="tight"><li>${esc(cfg.listening.split(' ').slice(0, 7).join(' '))} ___</li><li>${esc(cfg.vocab[1].example.replace(cfg.vocab[1].french, '___'))}</li><li>${esc(sharedReview[1].example.replace(sharedReview[1].french, '___'))}</li></ol><details><summary>Answer reveal</summary><p>Replay the passage and compare with the visible text above.</p></details></section>
    <section class="card"><h2>Listening Test</h2>${['What is the main situation?', 'Which new grammar pattern do you hear?', 'Which older review item returns?', 'Is the tone polite, descriptive, or narrative?'].map((q, i) => `<div class="question"><p>${i + 1}. ${q}</p><details><summary>Answer reveal</summary><p>Check the main listening passage and support your answer with one phrase.</p></details></div>`).join('')}</section>
    <section class="card"><h2>Answer Reveal</h2><details><summary>Show full listening text</summary><p>${esc(cfg.listening)}</p></details></section>
    <div class="footer-nav"><a class="button secondary" href="reading.html">Reading</a><a class="button" href="writing.html">Next: Writing</a></div>`;
  return layout(`Week ${w} Listening`, w, body);
}

function writingPage(w) {
  const cfg = weeks[w];
  const body = `
    <section class="card hero"><h1>Week ${w} Writing</h1><p>Writing moves from controlled sentence work to a short output task using this week plus older review.</p></section>
    <section class="card"><h2>Sentence Warm-Up</h2><ol class="tight"><li>Copy: ${esc(cfg.vocab[0].example)}</li><li>Change the person or object: ${esc(cfg.vocab[1].example)}</li><li>Add one older review word: ${esc(sharedReview[0].example)}</li></ol></section>
    <section class="card"><h2>Guided Writing</h2><p>Complete the frames with your own words.</p><ol class="tight"><li>Bonjour, je m'appelle ___.</li><li>${esc(cfg.vocab[0].example.split(' ').slice(0, 4).join(' '))} ___.</li><li>Avec Samira, je revise ___.</li><li>Dans ma phrase, j'utilise aussi ___.</li></ol></section>
    <section class="card"><h2>Controlled Writing</h2><p>Use these required chunks: ${esc(cfg.vocab.slice(0, 6).map(x => x.french).join(', '))}. Add two review chunks: ${esc(sharedReview.slice(0, 2).map(x => x.french).join(', '))}.</p></section>
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

function quizPage(w, items) {
  const cfg = weeks[w];
  const qs = [];
  for (const item of items.filter(x => x.status === 'new').slice(0, 18)) {
    qs.push({ scope: 'current week', prompt: `What does "${item.french}" mean in this week's context?`, answer: item.english, options: [item.english, 'I am', 'my family', 'the blue shirt'], explain: item.example });
  }
  for (const row of cfg.grammarRows.slice(0, 8)) {
    qs.push({ scope: 'current grammar', prompt: `Choose the example for: ${row[1]}`, answer: row[2], options: [row[2], sharedReview[0].example, sharedReview[1].example, cfg.vocab[0].english], explain: `Pattern: ${row[0]}` });
  }
  for (const item of items.filter(x => x.status !== 'new').slice(0, 12)) {
    qs.push({ scope: 'review', prompt: `Review in a sentence: "${item.example}" What is the key meaning of "${item.french}"?`, answer: item.english, options: [item.english, cfg.vocab[0].english, 'where', 'yesterday'], explain: item.exampleEnglish });
  }
  const checks = [
    ['In the reading, which older skill returns?', cfg.review],
    ['In the listening, what should you identify first?', 'people, place, and main action'],
    ['For writing, what should sentences be?', 'short enough to control'],
    ['What does the quiz mix include?', 'current week and review'],
    ['What should you do after an error?', 'read the explanation and retry']
  ];
  for (const [prompt, answer] of checks) qs.push({ scope: 'reading/listening/writing', prompt, answer, options: [answer, 'only isolated word recall', 'skip the review', 'use unlearned grammar freely'], explain: 'This course uses cumulative CLB-style practice.' });
  while (qs.length < 50) {
    const item = items[qs.length % items.length];
    qs.push({ scope: item.status === 'new' ? 'current week' : 'cumulative review', prompt: `Choose the sentence that correctly uses "${item.french}".`, answer: item.example, options: [item.example, `${item.french}. ${item.french}.`, 'Nous sommes un rouge table.', "J'ai est dans le bus."], explain: item.exampleEnglish });
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

function weekIndex(w) {
  const cfg = weeks[w];
  const prev = w > 1 ? `<a class="button secondary" href="../Week_${w - 1}/index.html">Previous Week</a>` : '';
  const next = w < 12 ? `<a class="button secondary" href="../Week_${w + 1}/index.html">Next Week</a>` : '';
  const body = `
    <section class="card hero">
      <h1>Week ${w} - ${esc(cfg.title)}</h1>
      <p><strong>What is new:</strong> ${esc(cfg.newLabel)}.</p>
      <p><strong>What is being reviewed:</strong> ${esc(cfg.review)}.</p>
      <p><strong>Learning goals:</strong> ${esc(cfg.goal)}</p>
      <div class="progress"><div class="bar" style="width:${(w / 30 * 100).toFixed(1)}%"></div></div>
    </section>
    <section class="card"><h2>Suggested Study Order</h2><ol class="tight"><li>Vocabulary</li><li>Grammar</li><li>Reading</li><li>Listening</li><li>Writing</li><li>Quiz</li></ol><div class="button-row"><a class="button" href="vocabulary.html">Start Vocabulary</a><a class="button secondary" href="quiz.html">Open Quiz</a></div></section>
    <section class="card"><h2>Review Is Built In</h2><p>${esc(cfg.vocab[0].example)} ${esc(sharedReview[0].example)} ${esc(sharedReview[1].example)}</p></section>
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
  write(path.join(dir, 'index.html'), weekIndex(w));
  write(path.join(dir, 'vocabulary.html'), vocabPage(w, items));
  write(path.join(dir, 'grammar.html'), grammarPage(w));
  write(path.join(dir, 'reading.html'), readingPage(w));
  write(path.join(dir, 'listening.html'), listeningPage(w));
  write(path.join(dir, 'writing.html'), writingPage(w));
  write(path.join(dir, 'quiz.html'), quizPage(w, items));
  write(path.join(dir, 'styles.css'), css);
  write(path.join(dir, 'audio.js'), audio);
  write(path.join(root, `week-${String(w).padStart(2, '0')}-summary.md`), `# Week-${String(w).padStart(2, '0')} Summary\n\n- Main grammar: ${weeks[w].main}.\n- Review grammar: ${weeks[w].review}.\n- Vocabulary count: 75 practice items (${weeks[w].vocab.length} new/current items plus cumulative review).\n- Quiz: 50 questions with current, recent review, reading/listening checks, and cumulative review.\n- Embedded review: older vocabulary and grammar appear inside vocabulary examples, grammar examples, reading, listening, writing prompts, and quiz sentences.\n- Story continuity: Alex, Samira, Marc, Madame Dupont, the cafe, class, apartment, bus, and neighborhood routines return.\n`);
}

const rootIndexCards = Object.entries(weeks).map(([w, cfg]) => `<article class="card"><h2>Week ${w} - ${esc(cfg.title)}</h2><span class="tag ${Number(w) < 12 ? 'done' : ''}">${Number(w) < 12 ? 'completed' : 'current'}</span><span class="tag">75 practice items</span><span class="tag">${esc(cfg.main.split(' ')[0])}</span><p>${esc(cfg.newLabel)}. Review: ${esc(cfg.review)}.</p><div class="button-row"><a class="button" href="Week_${w}/index.html">Open Week ${w}</a><a class="button secondary" href="Week_${w}/quiz.html">Week ${w} Quiz</a></div></article>`).join('\n');
const existing = `<article class="card"><h2>Week 1 - Bonjour, je suis Alex</h2><span class="tag done">completed</span><span class="tag">75 practice items</span><span class="tag">etre</span><p>Greetings, introductions, classroom words, days, and simple sentences with etre.</p><div class="button-row"><a class="button" href="Week_1/index.html">Open Week 1</a><a class="button secondary" href="Week_1/quiz.html">Week 1 Quiz</a></div></article>
<article class="card"><h2>Week 2 - J'ai dix ans</h2><span class="tag done">completed</span><span class="tag">75 practice items</span><span class="tag">avoir</span><p>Age, family basics, numbers, common objects, and active review of Week 1.</p><div class="button-row"><a class="button" href="Week_2/index.html">Open Week 2</a><a class="button secondary" href="Week_2/quiz.html">Week 2 Quiz</a></div></article>`;
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
      <p>A cumulative beginner French course for CLB 7 preparation, focused on reading, listening, writing, and memory through embedded review.</p>
      <p class="muted">Current progress: Week 12 generated out of 30 planned weeks. Week 12 is current; Weeks 1-11 are completed.</p>
      <div class="progress" aria-label="course progress"><div class="bar" style="width:40%"></div></div>
    </section>
    <section class="grid-2">
      ${existing}
      ${rootIndexCards}
    </section>
    <section class="card"><h2>Coming Next</h2><p>Week 13 will introduce the imperfect and contrast it with the passe compose while continuing to recycle Weeks 1-12.</p></section>
  </main>
</body>
</html>
`);

const originalCsv = fs.readFileSync(path.join(root, 'vocabulary_bank.csv'), 'utf8').split(/\r?\n/).filter(Boolean);
const header = originalCsv[0];
const firstTwoWeeks = originalCsv.slice(1).filter(line => /,1,|,2,/.test(line));
function csvCell(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
let id = 151;
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
write(path.join(root, 'vocabulary_bank.csv'), [header, ...firstTwoWeeks, ...generatedRows].join('\n') + '\n');

write(path.join(root, 'learner_state.md'), `# Learner State

## Current course status
- Current week: 12
- Completed weeks: week 1, week 2, week 3, week 4, week 5, week 6, week 7, week 8, week 9, week 10, week 11
- Last generated week: week 12

## Skill focus
- Primary goals: reading, listening, writing
- Speaking practice: external tutor
- Current overall level estimate: beginner with early A1 sentence control

## Strong areas
- recognizes greetings, etre, avoir, articles, common noun/adjective patterns, possessives, partitives, question forms, place expressions, reflexive routines, weather/time, present-tense work/study verbs, and early passe compose chunks
- can study current pages while automatically reviewing previous vocabulary inside examples, readings, listenings, writing prompts, and quizzes
- has recurring story anchors with Alex, Samira, Marc, Madame Dupont, the cafe, class, apartment, bus, park, and neighborhood

## Weak areas
- free production still needs guided models and short sentence frames
- adjective agreement, possessives, partitives, and question forms need ongoing contrast
- reflexive verbs and passe compose are new enough to require controlled production only
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
- imperfect: not introduced
- future forms: not introduced

## Vocabulary tracking
### Ordered vocabulary bank status
- Weeks 1-12 each have 75 numbered practice items.
- vocabulary_bank.csv tracks 900 entries total, with 75 entries per week.
- Each new week contains a smaller current-week load plus recent and older cumulative review.
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

### New vocabulary from latest week
- j'ai parle / tu as parle / il a parle / nous avons parle
- j'ai travaille / j'ai etudie / j'ai mange / j'ai bu / j'ai pris
- j'ai ecrit / j'ai lu / j'ai vu / j'ai fait / j'ai eu
- hier / avant-hier / la semaine derniere / deja
- journal / voyage / trajet / billet / valise / hotel / gare / musee
- d'abord / ensuite / apres / finalement

## Writing notes
- Writing comfort: beginner
- Current writing target: short past-tense diary using j'ai + past participle and earlier time/place/food/family content
- Current writing success target: guided 10-12 sentence past-tense diary with controlled passe compose chunks

## Listening notes
- Listening comfort: beginner
- Current listening target: short past-tense account with familiar review anchors
- Current listening success target: recognize who did what, when, where, and one food/travel/detail item

## Reading notes
- Reading comfort: beginner
- Current reading target: understand controlled daily-life and past-action passages that reuse prior weeks
- Current reading success target: identify main event, sequence markers, place, weather/time, and older grammar inside a short passage

## Personal preferences
- Wants progression and continuity
- Wants revision so words do not feel random
- Wants phonetic support
- Wants hidden English reveal
- Wants writing tests in addition to reading/listening
- Wants listening tests based on learned content
`);
