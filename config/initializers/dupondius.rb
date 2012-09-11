require 'dupondius'

Dupondius.configure do |config|
  config.access_key = ENV['AWS_ACCESS_KEY']
  config.secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
  config.project_name = ENV['PROJECT_NAME']

  # default to production keys? need to confirm with breno
  config.github_client_id = ENV['GITHUB_CLIENT_ID'] || 'bacdc0747b0175015bd9'
  config.github_secret = ENV['GITHUB_SECRET'] || '1fc790af87ad8f248dce004d8a52b4d3fe60997f'
end
