require 'dupondius'

begin
  require 'dotenv/tasks'
rescue LoadError
end


namespace :dupondius do

  namespace :aws do

    task :environment => :dotenv do
      Dupondius::Aws::Config.access_key = ENV['AWS_ACCESS_KEY']
      Dupondius::Aws::Config.secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
    end

    desc 'Creates a new dashboard instance '
    task :create_dashboard => :environment do |t, args|
      template_params = Dupondius::Aws::Stacks::Dashboard.template_params
      specified_params = ENV.to_hash.select { |k,v| template_params.include? k }
      if template_params.size != specified_params.size
        raise "Unable to find required params in ENV. #{template_params}"
      end
      result = Dupondius::Aws::Stacks::Dashboard.create(ENV['ProjectName'],
                                                         specified_params)
    end
    desc 'Creates a new single instance Rails stack'
    task :create_rails_single_instance => :environment do |t, args|
      template_params = Dupondius::Aws::Stacks::RailsSingleInstance.template_params
      specified_params = ENV.to_hash.select { |k,v| template_params.include? k }
      if template_params.size != specified_params.size
        raise "Unable to find required params in ENV. #{template_params}"
      end
      result = Dupondius::Aws::Stacks::RailsSingleInstance.create(ENV['EnvironmentName'],
                                                                  ENV['ProjectName'],
                                                                  specified_params)
    end

    desc 'Creates a new continuous integration instance from the given project'
    task :create_ci, [:project_name ] => :environment do |t, args|
      template_params = Dupondius::Aws::Stacks::ContinuousIntegration.template_params
      specified_params = ENV.to_hash.select { |k,v| template_params.include? k }
      if template_params.size != specified_params.size
        raise "Unable to find required params in ENV. #{template_params}"
      end
      result = Dupondius::Aws::Stacks::ContinuousIntegration.create(args.project_name, specified_params)
    end
  end

end

