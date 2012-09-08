
class Aws::StacksController < ApplicationController

  respond_to :json

  def index
    respond_with(Dupondius::Aws::CloudFormation.summaries(Rails.configuration.project_name))
  end

  def show
    stack = Dupondius::Aws::CloudFormation::Stack.find(params[:id])
    if stack
      respond_with(stack)
    else
      redirect :nothing => true, :status => 404
    end
  end

  def update
    render :nothing => true, :status => 404
  end

  def available
    respond_with(Dupondius::Aws::CloudFormation::STACKS)
  end

end
