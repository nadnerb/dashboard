set :domain,      "canary.#{ENV['PROJECT_NAME']}.dupondi.us"
set :rails_env,   "canary"
set :app_env,     "canary"
set :branch,      ENV["PIPELINE_VERSION"] || 'master'

role :web, domain
role :app, domain
role :db,  domain, :primary => true
