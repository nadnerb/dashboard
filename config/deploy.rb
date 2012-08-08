load "deploy/assets"
require 'bundler/capistrano'

default_run_options[:pty] = true

set :application, "dashboard"
set :repository,  "git@github.com:nadnerb/dashboard.git"
set :user, "deployer"  # The server's user for deploys
set :scm, :git
set :git_shallow_clone, 1
set :use_sudo, false
set :domain, 'dupondi.us' # Your domain goes here
set :applicationdir, "/opt/app/#{application}"
set :deploy_to, applicationdir

ssh_options[:keys] = %w(../deployer.pem)

role :web, "ec2-23-22-45-5.compute-1.amazonaws.com"                          # Your HTTP server, Apache/etc
role :app, "ec2-23-22-45-5.compute-1.amazonaws.com"                          # This may be the same as your `Web` server
role :db,  "ec2-23-22-45-5.compute-1.amazonaws.com", :primary => true # This is where Rails migrations will run

require 'capistrano-unicorn'
# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
 #namespace :deploy do
   #task :start do
      #run "cd #{current_path}/ && bundle exec foreman start"
   #end
   #task :stop do ; end
   #task :restart, :roles => :app, :except => { :no_release => true } do
     #run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
   #end
 #end
