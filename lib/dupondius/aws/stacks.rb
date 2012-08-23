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
       @template_name = name
       self.class_eval("def template_name; '#{name}';end")
    end

    def self.find name
      stack = Dupondius::Aws::Stacks.cloudformation.stacks["#{@template_name}#{name}"]
      stack.exists? ? self.new(stack) : nil
    end

    def self.create name, parameters
      Dupondius::Aws::Stacks.cloudformation.stacks.create("#{@template_name}#{name}", as_json,
        :parameters => parameters.merge({HostedZone: Dupondius::Aws::Config.hosted_zone, ProjectName: name}))
    end

    def self.template_params
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
  end


  class Dashboard < Base

    template :dashboard
  end

end; end; end
