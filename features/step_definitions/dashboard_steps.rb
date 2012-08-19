Given /^I go to the dashboard url$/ do
  visit('/dashboard')
end

Then /^I should see a dashboard, duh!$/ do
  find('.navbar .dashboard-brand').text.should == 'DASHBOARD'
end

Then /^the dashboard should have the correct version$/ do
end