require 'awesome_print'

Given /^I go to the dashboard url$/ do
  visit('/dashboard/monkeys_and_bananas')
  visit('/dashboard')
end

Then /^I should see a dashboard, duh!$/ do
  find('.navbar .dashboard-brand').text.should == 'DASHBOARD'
end

Then /^the dashboard should have the correct version$/ do
  if ENV['PIPELINE_BUILD_NUMBER']
    expected_version = 'v0.0.' + ENV['PIPELINE_BUILD_NUMBER']
  else
    expected_version = Dupondius::Version.version
  end
  versions = Hash[*find('footer .version').text.split(',').collect{ |val| val.strip.split(': ') }.flatten]
  if versions['Version'] != expected_version
    if ENV['GIT_COMMIT']
      expected_git_sha = ENV['GIT_COMMIT']
    else
      expected_git_sha = Dupondius::Version.refspec
    end
    fail "Expected version #{expected_version} but got #{versions['Version']} instead" unless expected_git_sha == versions['Git SHA']
  end
end

Given /^I go to the heart beat url$/ do
  visit('/status/heart_beat')
end

Then /^I should see OK$/ do
  page.text.should == 'OK'
end
