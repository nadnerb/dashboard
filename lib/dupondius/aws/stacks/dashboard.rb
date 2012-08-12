module Dupondius; module Aws; module Stacks

  class Dashboard

    def initialize project
      @project = project
    end

    def template
      @template ||= File.open(File.expand_path(
        File.join(File.dirname(__FILE__), '..', 'templates', 'dashboard.template')),
        'rb').read
    end

    def create parameters
      Dupondius::Aws::Stacks.cloudformation.stacks.create("dashboard-#{@project}", template,
        :parameters => parameters)
    end

    def params
      @param ||= validate[:parameters].collect { |p| p[:parameter_key] }
    end

    def validate
      Dupondius::Aws::Stacks.cloudformation.validate_template(template)
    end
  end

end; end; end

