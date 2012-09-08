class Aws::InstancesController < ApplicationController

  respond_to :json

  def index
    respond_with(Dupondius::Aws::Ec2::Instance.all(Rails.configuration.project_name))
  end

  def show
    respond_with(Dupondius::Aws::Ec2::Instance.find(params[:id]))
  end

  def update
    instance = Dupondius::Aws::Ec2::Instance.find(params[:id])
    instance.send(JSON.parse(request.body.read)['status'])
    respond_with(instance)
  end
end

