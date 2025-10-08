import { VocabularyItem } from "../types/vocabulary";
import { Word } from "../types/word";

class WordTransform {
  prepareWordExtended(word: Word): VocabularyItem {
    return {
      word: word.word,
      id: word.id,
      partOfSpeech: word.part_of_speech,
      rating: word.rank,
      category: word.category,
      meanings: word.meanings.map((meaning) => ({
        meaning: meaning.meaning,
        context: meaning.usage ?? "",
        example: meaning.example ?? "",
        exampleTranslation: meaning.example_translation ?? "",
      })),
      verb: word.verb_form
        ? {
            infinitive: word.verb_form.infinitive || "",
            present: word.verb_form.present || "",
            past: word.verb_form.past || "",
            perfect: word.verb_form.perfect || "",
            isIrregular: word.verb_form.is_irregular,
            isMmodal: word.verb_form.is_modal,
            isStrongVerb: word.verb_form.is_strong_verb,
            isSeparable: word.verb_form.is_separable,
            separablePrefix: word.verb_form.separable_prefix || "",
          }
        : undefined,
      noun: word.noun_form
        ? {
            indefiniteArticle: word.noun_form.indefinite_article || "",
            diminutive: word.noun_form.diminutive || "",
            plural: word.noun_form.plural || "",
            noun: word.noun_form.noun || "",
          }
        : undefined,
      adjective: word.adjective_form
        ? {
            adjective: word.adjective_form.adjective || "",
            deForm: word.adjective_form.de_form || "",
            comparison: word.adjective_form.comparison || "",
            superlative: word.adjective_form.superlative || "",
          }
        : undefined,
      numeral: word.numeral_form
        ? {
            numeral: word.numeral_form.numeral || "",
            numericValue: word.numeral_form.numeric_value,
            ordinalForm: word.numeral_form.ordinal_form || "",
          }
        : undefined,
    };
  }

  prepareWord(word: Word): VocabularyItem {
    return {
      word: word.word,
      id: word.id,
      partOfSpeech: word.part_of_speech,
      rating: word.rank,
      category: word.category,
      meanings: word.meanings.map((meaning) => ({
        meaning: meaning.meaning,
        context: meaning.usage ?? "",
        example: meaning.example ?? "",
        exampleTranslation: meaning.example_translation ?? "",
      })),
    };
  }
}

const wordTransform = new WordTransform();

export { wordTransform };
