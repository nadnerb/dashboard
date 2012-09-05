module Dupondius; module Aws; module Ec2

  def self.access
    @ec2 ||= AWS::EC2.new(:access_key_id => Dupondius::Aws::Config.access_key,
       :secret_access_key => Dupondius::Aws::Config.secret_access_key)
  end

  class Instance
    extend ::Forwardable

    def_delegators :@subject, :id, :instance_type, :status, :launch_time, :tags,
      :stop, :start, :terminate, :reboot

    def initialize subject
      @subject = subject
    end

    def self.find id
      Dupondius::Aws::Ec2.access.instances[id]
    end

    def self.all project_name
      Dupondius::Aws::Ec2::access.instances.filter("tag:dupondius:project", project_name).
        sort_by(&:launch_time).collect { |e| self.new(e) }
    end

    def to_h
      result = {}
      AWS.memoize do
        result = [:id, :instance_type, :status, :launch_time].inject({}) do |result, attribute|
          result[attribute] = self.send(attribute)
          result[:tags] = self.tags.to_h
          result
        end
      end
      result
    end
  end

end; end; end

