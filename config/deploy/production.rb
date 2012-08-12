set :domain,      "dupondi.us"
set :rails_env,   "production"
set :unicorn_env, "production"
set :app_env,     "production"

role :web, domain
role :app, domain
role :db,  domain, :primary => true
