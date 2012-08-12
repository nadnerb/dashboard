set :domain,      "staging.dupondi.us"
set :rails_env,   "staging"
set :unicorn_env, "staging"
set :app_env,     "staging"

role :web, domain
role :app, domain
role :db,  domain, :primary => true

