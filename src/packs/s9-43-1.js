// TITLE: Loch Ness
// EYEBROW: Spotlight 9 · стр. 43 · текст A
// SUB: 17 слов и выражений, чтобы описывать чудовищ. Карточки и семь тренировок — каждая по всем словам.
// BOARD: Твои слова
// LEAD: Каждый правильный ответ добавляет точку. Все точки зелёные — слово выучено. Красная рамка — повтори его.
const META = { ls: "s9-p43-1" };
const P = [
  { id: "eyes", phrase: "huge eyes", ru: "огромные глаза", en: "very big eyes" },
  { id: "tentacles", phrase: "giant tentacles", ru: "гигантские щупальца", en: "very long 'arms' of an octopus or a squid" },
  { id: "hooks", phrase: "sharp hooks", ru: "острые крючья", en: "pointed curved things used to catch and hold" },
  { id: "tail", phrase: "a long tail", ru: "длинный хвост", en: "the long part at the back of an animal's body" },
  { id: "humped", phrase: "a humped back", ru: "горбатая спина", en: "a back with a big round lump on it" },
  { id: "arms", phrase: "long arms", ru: "длинные руки", en: "arms that are not short" },
  { id: "neck", phrase: "a short neck", ru: "короткая шея", en: "a neck that is not long" },
  { id: "snake", phrase: "a snake-like head", ru: "змееподобная голова", en: "a head that looks like a snake's head" },
  { id: "twolegged", phrase: "two-legged", ru: "двуногий", en: "with two legs" },
  { id: "hairy", phrase: "a hairy body", ru: "волосатое тело", en: "a body covered with a lot of hair" },
  { id: "search", phrase: "in search of", ru: "в поисках", en: "looking for" },
  { id: "creatures", phrase: "creatures", ru: "существа", en: "living things, often strange animals" },
  { id: "today", phrase: "but to this day", ru: "но по сей день", en: "but even now" },
  { id: "probably", phrase: "probably", ru: "вероятно, возможно", en: "almost certainly" },
  { id: "couple", phrase: "a couple of", ru: "пара, несколько", en: "two or a few" },
  { id: "sightings", phrase: "sightings", ru: "случаи, когда кого-то видели", en: "times when people see something unusual" },
  { id: "dinosaur", phrase: "dinosaur", ru: "динозавр", en: "a very big animal that lived millions of years ago" }
];
const DRILLS = [
  { type: "meaning", title: "Найди слово", short: "RU → EN", instr: "Прочитай по-русски и выбери, как это будет по-английски." },
  { type: "mcq", title: "Что это значит?", short: "EN → RU", instr: "Прочитай слово по-английски и выбери перевод.", items: AUTO.enru() },
  { type: "gaps", title: "Describe the monster", short: "Monsters", instr: "Выбери слово, которое подходит по смыслу.",
    items: [
      { id: "eyes", t: "The owl looked at me with its {{*huge eyes|long arms|sharp hooks}} — they were like two big moons." },
      { id: "tentacles", t: "An octopus has eight {{*giant tentacles|huge eyes|long tails}}." },
      { id: "hooks", t: "Some squid have {{*sharp hooks|a humped back|a short neck}} on their tentacles." },
      { id: "tail", t: "A monkey uses {{*a long tail|a short neck|huge eyes}} to hold on to trees." },
      { id: "humped", t: "A camel has {{*a humped back|a snake-like head|giant tentacles}}." },
      { id: "arms", t: "Gorillas have {{*long arms|a long tail|a humped back}} and short legs." },
      { id: "neck", t: "A giraffe has a long neck, but a hippo has {{*a short neck|a snake-like head|giant tentacles}}." },
      { id: "snake", t: "In the photo, the monster had {{*a snake-like head|a hairy body|huge eyes}} on a long neck." },
      { id: "twolegged", t: "Birds and people are {{*two-legged|hairy|snake-like}}." },
      { id: "hairy", t: "The yeti has {{*a hairy body|giant tentacles|a snake-like head}} and very big feet." },
      { id: "search", t: "Every summer tourists come to Loch Ness {{*in search of|but to this day|a couple of}} the monster." },
      { id: "creatures", t: "Strange {{*creatures|sightings|hooks}} live at the bottom of the sea." },
      { id: "today", t: "People have looked for Nessie for years, {{*but to this day|in search of|a couple of}} nobody has found it." },
      { id: "probably", t: "It was {{*probably|a couple of|in search of}} just a big fish." },
      { id: "couple", t: "I've seen it {{*a couple of|probably|but to this day}} times." },
      { id: "sightings", t: "There have been many {{*sightings|creatures|dinosaurs}} of the monster in the lake." },
      { id: "dinosaur", t: "Some people think Nessie is a {{*dinosaur|sighting|couple}} that is still alive." }
    ] },
  { type: "mcq", title: "Guess the word", short: "Definitions", instr: "Прочитай объяснение по-английски и выбери слово.", items: AUTO.defn() },
  { type: "tf", title: "Right or wrong?", short: "Right or wrong", instr: "Предложение верное или с ошибкой?",
    items: [
      { id: "humped", t: "A camel has a humped back.", ok: true },
      { id: "neck", t: "A giraffe has a short neck.", ok: false, fix: "A giraffe has a long neck." },
      { id: "tentacles", t: "An octopus has giant tentacles.", ok: true },
      { id: "twolegged", t: "A snake is two-legged.", ok: false, fix: "A bird is two-legged; a snake has no legs." },
      { id: "dinosaur", t: "Dinosaurs are still alive today.", ok: false, fix: "Dinosaurs died out millions of years ago." },
      { id: "couple", t: "“A couple of” means “many, many”.", ok: false, fix: "“A couple of” means “two or a few”." },
      { id: "tail", t: "A monkey has a long tail.", ok: true },
      { id: "eyes", t: "An owl has huge eyes.", ok: true },
      { id: "search", t: "People come to Loch Ness in search of the monster.", ok: true },
      { id: "today", t: "There have been many sightings of Nessie, but to this day nobody has proved it exists.", ok: true },
      { id: "hairy", t: "A fish has a hairy body.", ok: false, fix: "A bear has a hairy body; a fish doesn't." }
    ] },
  { type: "gaps", title: "Choose the word: new sentences", short: "Choose", instr: "Теперь те же слова в новых предложениях. Выбери подходящее.",
    items: [
      { id: "eyes", t: "Cats can see well at night because they have {{*huge eyes|long arms|a humped back}}." },
      { id: "tentacles", t: "The Kraken wrapped its {{*giant tentacles|huge eyes|humped back}} around the ship." },
      { id: "hooks", t: "The fisherman bought some {{*sharp hooks|huge eyes|long tails}} for fishing." },
      { id: "tail", t: "My dog has {{*a long tail|a humped back|giant tentacles}} and he wags it when he's happy." },
      { id: "humped", t: "The old man walked slowly with {{*a humped back|a snake-like head|giant tentacles}}." },
      { id: "arms", t: "Basketball players often have {{*long arms|a long tail|sharp hooks}}." },
      { id: "neck", t: "Bulldogs have {{*a short neck|giant tentacles|sharp hooks}} and a big head." },
      { id: "snake", t: "The dragon in the film had {{*a snake-like head|a hairy body|long arms}} with a long thin tongue." },
      { id: "twolegged", t: "Chickens are {{*two-legged|hairy|snake-like}} birds." },
      { id: "hairy", t: "A bear has {{*a hairy body|a snake-like head|giant tentacles}} to keep warm in winter." },
      { id: "search", t: "We went into the forest {{*in search of|but to this day|probably}} mushrooms." },
      { id: "creatures", t: "Dragons and unicorns are magical {{*creatures|sightings|dinosaurs}}." },
      { id: "today", t: "My grandad lost his ring in 1990, {{*but to this day|in search of|a couple of}} we haven't found it." },
      { id: "probably", t: "Take an umbrella — it will {{*probably|a couple of|in search of}} rain." },
      { id: "couple", t: "Can I borrow {{*a couple of|probably|but to this day}} pens?" },
      { id: "sightings", t: "There were three {{*sightings|creatures|dinosaurs}} of a UFO over our town last year." },
      { id: "dinosaur", t: "The T-rex was a huge {{*dinosaur|sighting|couple}}." }
    ] },
  { type: "order", title: "Собери предложение", short: "Collect", instr: "Нажимай на слова по порядку и собери предложение по-английски. Печатать не нужно.",
    items: [
      { id: "search", q: "Туристы приезжают в поисках чудовища.", s: "Tourists come in search of the monster." },
      { id: "probably", q: "Это, вероятно, была большая рыба.", s: "It was probably a big fish." },
      { id: "couple", q: "Я видел его пару раз.", s: "I saw it a couple of times." },
      { id: "tail", q: "У чудовища был длинный хвост.", s: "The monster had a long tail." },
      { id: "eyes", q: "У него огромные глаза и острые крючья.", s: "It has huge eyes and sharp hooks." },
      { id: "today", q: "Но по сей день никто его не нашёл.", s: "But to this day nobody has found it." },
      { id: "sightings", q: "Было много случаев, когда его видели.", s: "There have been many sightings." },
      { id: "dinosaur", q: "Некоторые думают, что это динозавр.", s: "Some people think it is a dinosaur." },
      { id: "humped", q: "У верблюда горбатая спина.", s: "A camel has a humped back." }
    ] }
];
