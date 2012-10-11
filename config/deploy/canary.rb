set :domain,      "canary.#{ENV['PROJECT_NAME']}.dupondi.us"
set :rails_env,   "canary"
set :app_env,     "canary"
set :branch,      ENV["PIPELINE_VERSION"] || 'master'


server domain, :web, :app :db, :primary => true
#elastic_load_balancer domain, :app, :web, :db, :primary => true

