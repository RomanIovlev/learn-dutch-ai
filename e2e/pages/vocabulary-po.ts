import { CommonPage } from "./common-po";

export class VocabularyPage extends CommonPage {
  vocabularyStatsDashboard = this.page.getByTestId(
    "vocabulary-stats-dashboard"
  );
  sortAndSearch = this.page.getByTestId("vocabulary-search-and-sort");
  vocabularyStats = this.page.getByTestId("vocabulary-stats");
  vocabularyPartOfSpeech = this.page.getByTestId("vocabulary-part-of-speech");
  vocabularyItemCard = this.page.getByTestId("vocabulary-item-card");
  vocabularyActionBard = this.page.getByTestId("vocabulary-actions-bar");
  vocabularyEmptyState = this.page.getByTestId("vocabulary-actions-bar");
}
