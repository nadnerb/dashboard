load "deploy/assets"
require 'bundler/capistrano'

begin
  require 'dotenv'
  Dotenv.load
rescue
end
default_run_options[:pty] = true

# TODO: application should be set from project_name env var
set :application, "dashboard"
set :repository,  "git@github.com:nadnerb/dashboard.git"
set :user, "deployer"  # The server's user for deploys
set :scm, :git
set :git_shallow_clone, 1
set :use_sudo, false
set :applicationdir, "/opt/app/#{application}"
set :deploy_to, applicationdir

# TODO: Make the key an env var
ssh_options[:keys] = %w(../deployer.pem)

set :stages, %w(production staging qa canary)

require 'capistrano/ext/multistage'

after "deploy:update_code", "deploy:migrate"
after 'deploy:update', 'foreman:export'
after 'deploy:update', 'foreman:restart'

namespace :foreman do
  desc "Export the Procfile to inittab"
  task :export, :roles => :app do
    run ["cd #{release_path}",
      # Setup application environment variables
      "mkdir -p tmp/foreman",
      "echo \"RAILS_ENV=#{rails_env}\" > ./tmp/env",
      "echo \"PROJECT_NAME=#{ENV['PROJECT_NAME']}\" >> ./tmp/env",
      "echo \"LAUNCHPAD_ENABLED=#{ENV['LAUNCHPAD_ENABLED']}\" >> ./tmp/env",
      "echo \"LAUNCHPAD_JOBS=#{ENV['LAUNCHPAD_JOBS']}\" >> ./tmp/env",
      "echo \"AWS_ENABLED=#{ENV['AWS_ENABLED']}\" >> ./tmp/env",
      "echo \"AWS_ACCESS_KEY=#{ENV['AWS_ACCESS_KEY']}\" >> ./tmp/env",
      "echo \"AWS_SECRET_ACCESS_KEY=#{ENV['AWS_SECRET_ACCESS_KEY']}\" >> ./tmp/env",

      # Push the database environment variables into the app
      "cat /etc/default/database >> ./tmp/env",

      # Move it to the common place
      "sudo mv tmp/env /etc/default/#{application}",

      # Get foreman to the inittab script
      "bundle exec foreman export initscript ./tmp/foreman -e /etc/default/#{application} -f ./Procfile.production -a #{application} -u #{user} -l #{shared_path}/log",
      "sudo mv tmp/foreman/#{application} /etc/init.d",
      "chmod +x /etc/init.d/#{application}",
      "rm -rf tmp/foreman"
    ].join(' && ')
  end

  desc "Start the application services"
  task :start, :roles => :app do
    sudo "/etc/init.d/#{application} start"
  end

  desc "Stop the application services"
  task :stop, :roles => :app do
    sudo "/etc/init.d/#{application} stop"
  end

  desc "Restart the application services"
  task :restart, :roles => :app do
    sudo "/etc/init.d/#{application} restart"
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
