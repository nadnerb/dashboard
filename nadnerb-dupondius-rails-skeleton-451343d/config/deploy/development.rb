set :domain,      "dev.#{ENV['PROJECT_NAME']}.dupondi.us"
set :rails_env,   "development"
set :app_env,     "development"
set :branch,      ENV["PIPELINE_VERSION"] || 'master'

role :web, domain
role :app, domain
role :db,  domain, :primary => true
