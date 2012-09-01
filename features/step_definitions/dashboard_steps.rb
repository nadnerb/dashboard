require 'awesome_print'
require 'json'

Given /^I go to the status url$/ do
  visit('/status')
end

Then /^I should see the correct version$/ do
  if ENV['PIPELINE_VERSION']
    expected_version = ENV['PIPELINE_VERSION']
  elsif ENV['PIPELINE_BUILD_NUMBER']
    expected_version = 'v0.0.' + ENV['PIPELINE_BUILD_NUMBER']
  else
    expected_version = Dupondius::Version.version
  end
  versions = JSON.parse(page.text)
  if versions['version'] != expected_version
    expected_git_sha = `git log --decorate --format=format:'%H %d' --tags | grep v0.0. | cut -f1 -d\\ `
    fail "Expected version #{expected_version} but got #{versions['version']} instead" unless expected_git_sha == versions['git_commit']
  end
end

Given /^I go to the heart beat url$/ do
  visit('/status/heart_beat')
end

Then /^I should see OK$/ do
  @response.body.should == 'OK'
end
