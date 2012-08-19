@canary @javascript
Feature: Dashboard

  Scenario: The app should live
    Given I go to the heart beat url
    Then I should see OK

  Scenario: There should be a dashboard, all things considered
    Given I go to the dashboard url
    Then I should see a dashboard, duh!
    And the dashboard should have the correct version