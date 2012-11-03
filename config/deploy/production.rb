set :domain,      "production.#{ENV['PROJECT_NAME']}.dupondi.us"
set :rails_env,   "production"
set :app_env,     "production"
set :branch,      ENV["PIPELINE_VERSION"] || 'master'

server domain, :web, :app, :db, :primary => true
