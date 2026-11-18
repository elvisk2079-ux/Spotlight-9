// TITLE: Just an Illusion · Всё вместе
// EYEBROW: Spotlight 9 · стр. 48 · повторение после двух частей
// SUB: Все 25 слов вперемешку. Сделай это, когда пройдёшь обе части — лучше на следующий день.
// BOARD: Твои слова
// LEAD: Каждый правильный ответ добавляет точку. Все точки зелёные — слово выучено. Красная рамка — повтори его.
const META = { ls: "s9-p48-all", cards: false };
const P = [
  { id: "illusion", phrase: "an optical illusion", ru: "оптическая иллюзия", en: "a picture that tricks your eyes, so you see something that isn't really there" },
  { id: "track", phrase: "a train track", ru: "железнодорожный путь, рельсы", en: "the metal lines that trains run on" },
  { id: "further", phrase: "further", ru: "дальше", en: "at a greater distance" },
  { id: "seem", phrase: "seem to be", ru: "казаться (каким-то)", g: "seem", en: "to look like something is true" },
  { id: "eventually", phrase: "eventually", ru: "в конце концов, в итоге", en: "after a long time; in the end" },
  { id: "appear", phrase: "appear", ru: "казаться; появляться", g: "seem", en: "to seem; to come into view" },
  { id: "touch", phrase: "touch", ru: "касаться, соприкасаться", en: "to be so close to something that there is no space between" },
  { id: "simply", phrase: "simply", ru: "просто", en: "only, just" },
  { id: "tricks", phrase: "play tricks on", ru: "обманывать, подшучивать над", en: "to make someone believe something that isn't true" },
  { id: "seeing", phrase: "seeing", ru: "зрение, видение (процесс)", en: "the act of using your eyes" },
  { id: "complicated", phrase: "complicated", ru: "сложный", en: "difficult to understand, with many parts" },
  { id: "images", phrase: "images", ru: "изображения", en: "pictures" },
  { id: "learn", phrase: "learn – learnt", ru: "учиться, узнавать", en: "to get new knowledge or a new skill", say: "learn, learnt" },
  { id: "certain", phrase: "a certain way", ru: "определённым образом", en: "in one particular way" },
  { id: "example", phrase: "for example", ru: "например", en: "you say this before you give an example" },
  { id: "why", phrase: "this is why", ru: "вот почему, поэтому", en: "you say this to give the reason for something" },
  { id: "teach", phrase: "teach – taught", ru: "учить (кого-то), обучать", en: "to help someone learn something", say: "teach, taught" },
  { id: "firstly", phrase: "firstly", ru: "во-первых", en: "you say this before your first point" },
  { id: "opinion", phrase: "opinion", ru: "мнение", en: "what you think about something" },
  { id: "different", phrase: "in a different way", ru: "по-другому, иначе", en: "not in the same way" },
  { id: "know", phrase: "but we all know", ru: "но мы все знаем", en: "you say this when everyone is sure about something" },
  { id: "really", phrase: "don't really", ru: "на самом деле не", en: "you say this when something isn't true in reality" },
  { id: "else", phrase: "something else", ru: "что-то другое, что-то ещё", en: "a different thing" },
  { id: "continue", phrase: "continue", ru: "продолжать", en: "to keep doing something" },
  { id: "stare", phrase: "stare at", ru: "пристально смотреть, уставиться на", en: "to look at something for a long time" }
];
const DRILLS = [
  { type: "meaning", title: "Найди слово", short: "RU → EN", instr: "Прочитай по-русски и выбери, как это будет по-английски." },
  { type: "gaps", title: "Choose the word: the text", short: "Text", instr: "Это предложения из текста «Just an Illusion». Выбери слово, которое было в тексте.",
    items: [
      { id: "track", t: "If you stand at the end of a {{*train track|opinion|image}} and look down it, what do you see?" },
      { id: "further", t: "The {{*further|firstly|simply}} down the tracks you look, the closer the two tracks seem to be." },
      { id: "seem", t: "The further you look, the closer the two tracks {{*seem to be|stare at|teach}}." },
      { id: "eventually", t: "{{*Eventually|Complicated|Opinion}}, they appear to touch." },
      { id: "appear", t: "Eventually, they {{*appear|learn|stare}} to touch." },
      { id: "touch", t: "They appear to {{*touch|teach|learn}}, but we all know that they don't really." },
      { id: "know", t: "They appear to touch, {{*but we all know|for example|this is why}} that they don't really." },
      { id: "really", t: "…but we all know that they {{*don't really|simply|eventually}}." },
      { id: "simply", t: "Our eyes are {{*simply|further|firstly}} playing tricks on us." },
      { id: "tricks", t: "Our eyes are simply {{*playing tricks on|appearing|continuing}} us." },
      { id: "seeing", t: "Simply because {{*seeing|touching|continuing}} is a complicated process!" },
      { id: "complicated", t: "Seeing is a {{*complicated|further|simply}} process!" },
      { id: "images", t: "Our eyes take in {{*images|opinions|tracks}} all day long." },
      { id: "learn", t: "Our brain then {{*learns|teaches|stares}} how to see things a certain way." },
      { id: "certain", t: "Our brain learns how to see things {{*a certain way|for example|this is why}}." },
      { id: "example", t: "When we watch TV, {{*for example|something else|a certain way}}, our brain has learnt to see movement." },
      { id: "why", t: "{{*This is why|A certain way|Something else}} we can have so much fun with optical illusions!" },
      { id: "illusion", t: "This is why we can have so much fun with {{*optical illusions|train tracks|opinions}}!" },
      { id: "teach", t: "Optical illusions can {{*teach|learn|stare}} us some important lessons about life." },
      { id: "firstly", t: "{{*Firstly|Further|Opinion}}, there may be more to a situation than we see at first." },
      { id: "else", t: "We see one thing at first and {{*something else|for example|a certain way}} when we continue to stare at it." },
      { id: "continue", t: "…and something else when we {{*continue|teach|touch}} to stare at it." },
      { id: "stare", t: "…and something else when we continue to {{*stare at|teach|appear}} it." },
      { id: "opinion", t: "It's okay if you and your friend have a different {{*opinion|image|track}} about something." },
      { id: "different", t: "You are just seeing things {{*in a different way|a train track|for example}}, that's all!" }
    ] }
];
