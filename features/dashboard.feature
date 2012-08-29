@canary @qa @staging @production @deploy_test @javascript
Feature: Dashboard

  Scenario: The app should live
    Given I go to the heart beat url
    Then I should see OK

  Scenario: There should be a dashboard, all things considered
    Given I go to the status url
    Then I should see the correct version