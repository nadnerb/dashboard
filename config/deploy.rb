load "deploy/assets"
require 'bundler/capistrano'

default_run_options[:pty] = true

set :application, "dashboard"
set :repository,  "git@github.com:nadnerb/dashboard.git"
set :user, "deployer"  # The server's user for deploys
set :scm, :git
set :git_shallow_clone, 1
set :use_sudo, false
set :domain, 'dupondi.us'
set :applicationdir, "/opt/app/#{application}"
set :deploy_to, applicationdir

# Make the key an env var
ssh_options[:keys] = %w(../deployer.pem)

set :stages, %w(production staging qa canary)

require 'capistrano/ext/multistage'

after 'deploy:update', 'foreman:export'
after 'deploy:update', 'foreman:restart'

namespace :foreman do
  desc "Export the Procfile to inittab"
  task :export, :roles => :app do
    run ["cd #{release_path}",
      "mkdir -p tmp/foreman",
      "bundle exec foreman export initscript ./tmp/foreman -f ./Procfile -a #{application} -u #{user} -l #{shared_path}/log",
      "sudo mv tmp/foreman/#{application} /etc/init.d",
      "rm -rf tmp/foreman"
    ].join(' && ')
  end

  desc "Start the application services"
  task :start, :roles => :app do
    sudo "start #{application}"
  end

  desc "Stop the application services"
  task :stop, :roles => :app do
    sudo "stop #{application}"
  end

  desc "Restart the application services"
  task :restart, :roles => :app do
    run "sudo start #{application} || sudo restart #{application}"
  end

  desc "Display logs for a certain process - arg example: PROCESS=web-1"
  task :logs, :roles => :app do
    run "cd #{current_path}/log && cat #{ENV["PROCESS"]}.log"
  end
end

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
