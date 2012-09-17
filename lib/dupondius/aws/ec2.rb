require 'yaml'
module Dupondius; module Aws; module Ec2

  def self.access
    @ec2 ||= AWS::EC2.new(:access_key_id => Dupondius.config.access_key,
       :secret_access_key => Dupondius.config.secret_access_key)
    @ec2.regions[Dupondius::Config.aws_region]
  end

  def self.cost_table
    @cost_table ||= YAML.load_file(File.expand_path(File.join(File.dirname(__FILE__), 'ec2-cost.yml')))
  end
  class Instance
    extend ::Forwardable

    attr_reader :subject
    def_delegators :@subject, :id, :instance_type, :status, :launch_time, :tags,
      :availability_zone, :stop, :start, :terminate, :reboot, :platform

    def initialize subject
      @subject = subject
    end

    def self.find id
      self.new(Dupondius::Aws::Ec2.access.instances[id])
    end

    def self.all project_name= Dupondius.config.project_name
      Dupondius::Aws::Ec2::access.instances.filter("tag:dupondius:project", project_name).
        sort_by(&:launch_time).collect { |e| self.new(e) }
    end

    def cost multiplier = 1
      AWS.memoize do
        platform = self.platform ? self.platform : 'linux'
        Dupondius::Aws::Ec2.cost_table[Dupondius.config.aws_region][platform][self.instance_type].to_f * multiplier
      end
    end
    def as_json options = {}
      result = {}
      AWS.memoize do
        result = [:id, :instance_type, :status, :availability_zone, :launch_time, :cost].inject({}) do |result, attribute|
          result[attribute] = self.send(attribute)
          result[:tags] = self.tags.to_h
          result
        end
      end
      result
    end
  end

end; end; end

