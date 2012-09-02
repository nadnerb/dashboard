#require 'dupondius/aws/stacks/rails'

module Dupondius; module Aws; module Stacks

  def self.cloudformation
    @cfn ||= AWS::CloudFormation.new(:access_key_id => Dupondius::Aws::Config.access_key,
       :secret_access_key => Dupondius::Aws::Config.secret_access_key)
  end

  class Base
    attr_reader :stack

    def initialize stack
      @stack = stack
    end
    def self.template name
       @template_name = name.to_s
       self.class_eval("def template_name; '#{name}';end")
    end

    def self.find environment_name, project_name
      stack = Dupondius::Aws::Stacks.cloudformation.stacks["#{environment_name}-#{project_name}"]
      stack.exists? ? self.new(stack) : nil
    end

    def self.create environment_name, project_name, parameters
      Dupondius::Aws::Stacks.cloudformation.stacks.create("#{environment_name}-#{project_name}", as_json,
        :parameters => parameters.merge({HostedZone: Dupondius::Aws::Config.hosted_zone, ProjectName: project_name}))
    end

    def self.template_params
      puts Dupondius::Aws::Stacks.cloudformation.validate_template(self.as_json)
      Dupondius::Aws::Stacks.cloudformation.validate_template(self.as_json)[:parameters].collect { |p| p[:parameter_key] }
    end

    def self.as_json
      @template_json ||= File.open(File.expand_path(File.join(
        File.dirname(__FILE__), '..', 'aws', 'templates', "#{@template_name}.template")), 'rb').read
    end

    def complete?
      @stack.status == 'CREATE_COMPLETE'
    end

  end

  class ContinuousIntegration < Base

    template :jenkins

    def self.create project_name, parameters
      super('ci', project_name, parameters)
    end

    def self.find project_name
      super('ci', project_name)
    end
  end


  class Dashboard < Base

    def self.create project_name, parameters
      super('dashboard', project_name, parameters)
    end

    def self.find project_name
      super('dashboard', project_name)
    end

    def self.as_json
      template= JSON.parse(File.open(File.expand_path(File.join(File.dirname(__FILE__), '..', 'aws', 'templates', "rails_single_instance.template")), 'rb').read)

      user_data = template['Resources']['WebServer']['Properties']['UserData']['Fn::Base64']['Fn::Join'].last
      user_data.insert((user_data.size) -4, "curl -L https://s3.amazonaws.com/dupondius/config/install-dashboard | bash \n")
      JSON.pretty_generate(template)
    end
  end

  class RailsSingleInstance < Base

    template :rails_single_instance
  end
end; end; end
