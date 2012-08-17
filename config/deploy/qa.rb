set :domain,      "qa.dupondi.us"
set :rails_env,   "qa"
set :app_env,     "qa"

role :web, domain
role :app, domain
role :db,  domain, :primary => true
