module Dupondius; module Aws

  class Route53

    def self.access
      @cfn ||= AWS::Route53.new(:access_key_id => Dupondius.config.access_key,
         :secret_access_key => Dupondius.config.secret_access_key)
    end

  end

end; end
