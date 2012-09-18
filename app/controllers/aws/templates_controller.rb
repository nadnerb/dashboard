
class Aws::TemplatesController < ApplicationController

  respond_to :json

  def index
    respond_with(Dupondius::Aws::CloudFormation::Stack::TEMPLATES)
  end

  def show
    template = Dupondius::Aws::CloudFormation::Stack.validate_template(params[:id])
    template[:parameters].reject! do |p|
      ['ProjectName', 'HostedZone', 'AwsAccessKey', 'AwsSecretAccessKey', 'KeyName'].include? p[:parameter_key]
    end
    respond_with(template)
  end
end
