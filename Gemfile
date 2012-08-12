source 'https://rubygems.org'

gem 'rails', '3.2.7'
gem 'bigdecimal'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'sqlite3'
gem 'delayed_job_active_record'
gem 'daemons'
gem 'haml-rails'

gem 'oauth2'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer', :platform => :ruby

  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

# Deploy with Capistrano
group :development do
  gem 'capistrano', :require => false
  gem 'capistrano-unicorn', :require => false
end

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

gem "capybara", :group => [:development, :test]
gem "rspec-rails", :group => [:development, :test]
gem "simple_form"
gem "sqlite3", :group => [:development, :test]
group :assets do
  gem "twitter-bootstrap-rails"
  gem "therubyracer"
end

gem "unicorn"
gem "foreman"

gem 'aws-sdk'
gem 'aws-s3'

