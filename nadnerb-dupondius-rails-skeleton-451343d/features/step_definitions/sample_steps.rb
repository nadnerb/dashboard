Given /^I go to the app url$/ do
   visit('/')
end
 
Then /^I should see the default rails page$/ do
   page.text.should =~ /rails/
end

