require 'dupondius/aws/stacks/dashboard'
require 'dupondius/aws/stacks/rails'

module Dupondius; module Aws; module Stacks

  def self.cloudformation
    @cfn ||= AWS::CloudFormation.new(:access_key_id => Dupondius::Aws::Config.access_key,
       :secret_access_key => Dupondius::Aws::Config.secret_access_key)
  end

end; end; end
