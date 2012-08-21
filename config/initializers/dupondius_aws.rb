require 'dupondius'

Dupondius::Aws::Config.access_key = ENV['AWS_ACCESS_KEY']
Dupondius::Aws::Config.secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
