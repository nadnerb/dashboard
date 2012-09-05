class Aws::InstancesController < ApplicationController

  respond_to :json

  def index
    respond_with(Dupondius::Aws::Ec2::Instance.all(Rails.configuration.project_name).collect(&:to_h))
  end

  def update
    instance = Dupondius::Aws::Ec2::Instance.find(params[:id])
    instance.send(JSON.parse(request.body.read)['status'])
    render :json => instance.to_h
  end
end

