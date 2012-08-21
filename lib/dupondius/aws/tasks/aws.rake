require 'dupondius'

namespace :dupondius do

  namespace :aws do

    desc 'Creates a new dashboard from the given project'
    task :create_dashboard, [:project_name ] do |t, args|
      dashboard = Dupondius::Aws::Stacks::Dashboard.new args.project_name

      specified_params = ENV.to_hash.select { |k,v| dashboard.params.include? k }
      if dashboard.params.size != specified_params.size
        raise "Unable to find required params in ENV. #{dashboard.params}"
      end
      result = dashboard.create(specified_params)
      puts result
    end

    desc 'Creates a new continuous integration instance from the given project'
    task :create_ci, [:project_name ] do |t, args|

      instance = Dupondius::Aws::Stacks::ContinuousIntegration.new args.project_name

      specified_params = ENV.to_hash.select { |k,v| instance.params.include? k }
      if instance.params.size != specified_params.size
        raise "Unable to find required params in ENV. #{instance.params}"
      end
      result = instance.create(specified_params)
      puts result
    end
  end

end

