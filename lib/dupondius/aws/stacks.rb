require 'dupondius/aws/stacks/base'
require 'dupondius/aws/stacks/dashboard'
require 'dupondius/aws/stacks/continuous_integration'
require 'dupondius/aws/stacks/rails'

module Dupondius; module Aws; module Stacks

  def self.cloudformation
    @cfn ||= AWS::CloudFormation.new(:access_key_id => Dupondius::Aws::Config.access_key,
       :secret_access_key => Dupondius::Aws::Config.secret_access_key)
  end

  class Base

    def initialize project
      @project = project
    end

    def self.template name
       self.class_eval("def template_name; '#{name}';end")
    end

    def create parameters
      Dupondius::Aws::Stacks.cloudformation.stacks.create("#{template_name}#{@project}", as_json,
        :parameters => parameters)
    end

    def params
      @param ||= validate[:parameters].collect { |p| p[:parameter_key] }
    end

    def validate
      Dupondius::Aws::Stacks.cloudformation.validate_template(as_json)
    end

    def as_json
      @template_json ||= File.open(File.expand_path(File.join(
        File.dirname(__FILE__), '..', 'templates', "#{template_name}.template")), 'rb').read
    end
  end

  class ContinuousIntegration < Base

    template :jenkins
  end


  class Dashboard < Base

    template :dashboard
  end

end; end; end
