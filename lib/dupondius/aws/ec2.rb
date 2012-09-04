module Dupondius; module Aws; module Ec2

  def self.access
    @ec2 ||= AWS::EC2.new(:access_key_id => Dupondius::Aws::Config.access_key,
       :secret_access_key => Dupondius::Aws::Config.secret_access_key)
  end

  class Instance

    def initialize subject
      @subject = subject
    end

    def method_missing(sym, *args, &block)
      @subject.send sym, *args, &block
    end

    def self.all project_name
      Dupondius::Aws::Ec2::access.instances.filter("tag:dupondius:project", project_name).
        sort_by(&:launch_time).collect { |e| self.new(e) }
    end

    def start
    end

    def stop
    end

    def terminate
    end

    def to_json options={}
      result = {}
      AWS.memoize do
        result = [:id, :instance_type, :status, :launch_time].inject({}) do |result, attribute|
          result[attribute] = self.send(attribute)
          result[:tags] = self.tags.to_h
          result
        end
      end
      result.to_json
    end
  end

end; end; end

