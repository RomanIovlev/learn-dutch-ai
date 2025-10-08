import { CommonPage } from "./common-po";

export class ExercisesPage extends CommonPage {
  exerciseSelector = this.page.getByTestId("exercise-selector");
  exerciseBanner = this.page.getByTestId("exercise-banner");
  fillExerciseForms = this.page.getByTestId("fill-form-exercises");
  fillGapExercises = this.page.getByTestId("fill-gap-exercises");
  actions = this.page.getByTestId("actions");
}
