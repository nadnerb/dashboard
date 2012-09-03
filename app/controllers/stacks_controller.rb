
class StacksController < ApplicationController

  respond_to :json


  def index
    respond_with(Dupondius::Aws::CloudFormation.summaries(Rails.configuration.project_name))
  end

  def show
  end



end
