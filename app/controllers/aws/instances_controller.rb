class Aws::InstancesController < ApplicationController

  respond_to :json

  def index
    render :json => Dupondius::Aws::Ec2::Instance.all(Rails.configuration.project_name).collect { |i| i.to_json }
  end


  def update
    render :nothing => true, :status => 404
  end
end

