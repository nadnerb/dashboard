require 'dupondius'

Dupondius.configure do |config|
  config.key_name = 'team-brats'
  config.aws_region = ENV['AWS_REGION']
  config.access_key = ENV['AWS_ACCESS_KEY_ID']
  config.secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
  config.project_name = ENV['PROJECT_NAME']

  config.github_client_id = ENV['GITHUB_CLIENT_ID'] || 'bacdc0747b0175015bd9'
  config.github_secret = ENV['GITHUB_SECRET'] || '1fc790af87ad8f248dce004d8a52b4d3fe60997f'
end
