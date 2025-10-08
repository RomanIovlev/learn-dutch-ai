Feature: Vocabulary Quiz with Mocked Data
    As a Dutch language learner
    I want to practice vocabulary with predictable quiz questions
    So that I can test the quiz functionality reliably

    Background:
        Given the API returns mock vocabulary data with the following words:
            | word  | meaning | rating | part_of_speech | id |
            | hond  | dog     | 5      | noun           | 1  |
            | kat   | cat     | 3      | noun           | 2  |
            | huis  | house   | 8      | noun           | 3  |
            | water | water   | 10     | noun           | 4  |
            | eten  | food    | 2      | noun           | 5  |
            | boek  | book    | 7      | noun           | 6  |

    Scenario: Display quiz with mocked vocabulary data
        Given I am on the vocabulary quiz page
        When the page loads with mocked API data
        Then I should see the quiz card displaying "hond"
        And I should see the quiz options container
        And I should see "dog" as one of the answer options
        And I should see other words as five variants
        And I shoudld see "Reset All Progress"
        And the quiz functionality should work with predictable data

    Scenario: Click correct quiz variant
        Given the quiz page has quiz card "hond" and 6 variants loaded from mock data
        When I click on the right option "dog"
        Then the card should flip and display the correct translation "dog"
        And correct option "dog" has correct word style
        And banner with text "Correct!" shoudld be visible
        And status card with correct words has +1
        When I click on the page
        Then new the card is flipped
        And new word "kat" is displayed
        And banner with text "Correct!" shoudld not be visible
        And option button style is neutral

    Scenario: Click wrong quiz variant
        Given the quiz page has quiz card "hond" and 6 variants loaded from mock data
        When I click on the wrong option "cat"
        Then the card should flip and display the correct translation "dog"
        And wrong option "cat" has correct word style
        And correct option "dog" has correct word style
        And banner with text "Incorrect!" shoudld be visible
        And status card with incorrect words has +1
        When I click on the page
        Then new the card is flipped
        And new word "kat" is displayed
        And banner with text "Incorrect!" shoudld not be visible
        And option button style is neutral

    Scenario: Quiz result is applied
        Given I am on the vocabulary quiz page
        When quiz is finished
        Then quiz card is not displayed
        And quiz variants are not displayed
        And correct answers card shows appropriate number of correct answers
        And inorrect answers card shows appropriate number of incorrect answers
        And button "Apply progress" is displayed
        When I click button "Apply progress"
        Then mocked update rating API is triggered
        And the quiz is displayed upnew

    Scenario: Quiz result is reset
        Given I am on the vocabulary quiz page
        When I click button "Reset All Progress"
        Then mocked update rating API is not triggered
        And the quiz is displayed upnew
