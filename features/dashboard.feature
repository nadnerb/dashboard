@canary
Feature: Dashboard

  Scenario: There should be a dashboard, all things considered
    Given I go to the dashboard url
    Then I should see a dashboard, duh!
    And the dashboard should have the correct version