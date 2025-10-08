import { PartOfSpeech } from "../../types/word";
import { ALL_PARTS_OF_SPEECH } from "../vocabulary-config";

export const VocabularyPartOfSpeech = ({
  wordPartOfSpeech,
  onSetWordPartOfSpeech,
}: {
  wordPartOfSpeech: PartOfSpeech | "all";
  onSetWordPartOfSpeech: (partOfSpeech: PartOfSpeech | "all") => void;
}) => {
  return (
    <div
      className="flex flex-wrap gap-2 my-4"
      data-testid="vocabulary-part-of-speech"
    >
      {[...ALL_PARTS_OF_SPEECH, "all"].map((part) => (
        <button
          key={part}
          className={`capitalize px-2 rounded-xl border border-brand-500 ${
            part === wordPartOfSpeech ? "text-white" : "text-brand-500"
          } ${
            part === wordPartOfSpeech
              ? "bg-gradient-to-r from-indigo-400 to-blue-500"
              : "bg-white"
          }`}
          onClick={() => onSetWordPartOfSpeech(part as PartOfSpeech | "all")}
        >
          {part}
        </button>
      ))}
    </div>
  );
};
