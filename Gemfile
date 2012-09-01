source 'https://rubygems.org'

gem 'rails', '3.2.7'
gem 'bigdecimal'
gem 'appscrolls', :git => 'git@github.com:nadnerb/appscrolls.git'
gem 'foreman-export-initscript', :git => 'git://github.com/Draiken/foreman-export-initscript.git'
gem 'pivotal-tracker'

gem 'delayed_job_active_record'
gem 'daemons'

gem 'oauth2'
gem 'rest-client'
gem 'yajl-ruby'
gem 'octokit'
gem 'omniauth'
gem 'omniauth-openid'
gem 'omniauth-google-apps'
gem 'devise'
gem 'newrelic_rpm'
gem 'json'

gem 'haml-rails'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer', :platform => :ruby

  gem 'uglifier', '>= 1.0.3'
end

gem 'mysql2'
gem 'jquery-rails'

# Deploy with Capistrano
group :development do
  gem 'capistrano', :require => false
  gem 'sqlite3'
end

gem "simple_form"

group :development, :test do
  gem "capybara"
  gem "capybara-webkit"
  gem "rspec-rails"
  gem "sqlite3"

  gem 'jasmine'
  gem 'jasmine-headless-webkit'
  gem 'jasmine-spec-extras'

  gem 'awesome_print', :require => 'ap'
  gem 'thin'
  gem 'dotenv'
end

group :test do
  gem 'cucumber-rails', :require => false
  # database_cleaner is not required, but highly recommended
  gem 'database_cleaner'
end

group :assets do
  gem "twitter-bootstrap-rails"
  gem "therubyracer"
end

gem 'unicorn'
gem 'foreman'

gem 'aws-sdk'
gem 'aws-s3'

