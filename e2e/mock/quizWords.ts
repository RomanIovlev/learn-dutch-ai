export const correctListWords = [
  { word: "hond", meaning: "dog" },
  { word: "kat", meaning: "cat" },
  { word: "huis", meaning: "house" },
  { word: "water", meaning: "water" },
  { word: "eten", meaning: "food" },
  { word: "boek", meaning: "book" },
];

export const incorrectListWords = [
  { word: "hond", meaning: "cat" },
  { word: "kat", meaning: "dog" },
  { word: "huis", meaning: "water" },
  { word: "water", meaning: "house" },
  { word: "eten", meaning: "book" },
  { word: "boek", meaning: "food" },
];

export const mockQuizWords = [
  {
    id: 1,
    word: "hond",
    meanings: [{ meaning: "dog" }],
    rank: 5,
    part_of_speech: "noun",
  },
  {
    id: 2,
    word: "kat",
    meanings: [{ meaning: "cat" }],
    rank: 3,
    part_of_speech: "noun",
  },
  {
    id: 3,
    word: "huis",
    meanings: [{ meaning: "house" }],
    rank: 8,
    part_of_speech: "noun",
  },
  {
    id: 4,
    word: "water",
    meanings: [{ meaning: "water" }],
    rank: 10,
    part_of_speech: "noun",
  },
  {
    id: 5,
    word: "eten",
    meanings: [{ meaning: "food" }],
    rank: 2,
    part_of_speech: "noun",
  },
  {
    id: 6,
    word: "boek",
    meanings: [{ meaning: "book" }],
    rank: 7,
    part_of_speech: "noun",
  },
];

export const wordUpRankItemsPatch = mockQuizWords.map((word) => ({
  word_id: word.id,
  rank: word.rank + 1,
}));
