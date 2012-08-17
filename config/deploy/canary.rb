set :domain,      "canary.dupondi.us"
set :rails_env,   "canary"
set :app_env,     "canary"

role :web, domain
role :app, domain
role :db,  domain, :primary => true

