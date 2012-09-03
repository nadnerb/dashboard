
class StacksController < ApplicationController

  respond_to :json

  def index
    respond_with(Dupondius::Aws::CloudFormation.summaries(Rails.configuration.project_name))
  end

  def show
    stack = Dupondius::Aws::CloudFormation::Stack.find(params[:id])
    if stack
      respond_with(stack)
    else
      redirect_to :status => 404
    end
  end

end
