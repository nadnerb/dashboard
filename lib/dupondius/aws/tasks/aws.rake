require 'dupondius'

begin
  require 'dotenv/tasks'
rescue LoadError
end


namespace :dupondius do

  namespace :aws do

    task :environment => :dotenv do
      Dupondius.configure do |config|
        config.access_key = ENV['AWS_ACCESS_KEY_ID']
        config.secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
      end
    end

    desc 'Creates a new stack'
    task :create_stack, [:stack_name] => :environment do |t, args|
      template_params = Dupondius::Aws::CloudFormation::Stack.template_params(args.stack_name)
      specified_params = ENV.to_hash.select { |k,v| template_params.include? k}.inject({}){|memo,(k,v)| memo[k.to_sym] = v; memo}
      if template_params.size != specified_params.size
        raise "Unable to find required params in ENV. #{template_params}"
      end
      result = Dupondius::Aws::CloudFormation::Stack.create(args.stack_name,
                                                       ENV['EnvironmentName'],
                                                       ENV['ProjectName'],
                                                       specified_params)
    end
  end

end

