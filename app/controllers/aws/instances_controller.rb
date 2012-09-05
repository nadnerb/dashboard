class Aws::InstancesController < ApplicationController

  respond_to :json

  def index
    respond_with(Dupondius::Aws::Ec2::Instance.all(Rails.configuration.project_name).collect(&:to_h))
  end


  def update
    render :nothing => true, :status => 404
  end
end

