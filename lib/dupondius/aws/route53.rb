module Dupondius; module Aws

  class Route53

    def self.access
      @cfn ||= AWS::Route53.new(:access_key_id => Dupondius::Aws::Config.access_key,
         :secret_access_key => Dupondius::Aws::Config.secret_access_key)
    end

  end

end; end