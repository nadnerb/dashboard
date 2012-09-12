
class Aws::StacksController < ApplicationController

  respond_to :json

  def index
    respond_with(Dupondius::Aws::CloudFormation.summaries)
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
    stack = Dupondius::Aws::CloudFormation::Stack.find(params[:id])
    stack.update(params[:stack])
    respond_with(stack)
  end

  def create
    #TODO: Stop the ui from passing 'random' in the payload
    stack_params = params[:stack]
    stack_params.delete('random')
    result = Dupondius::Aws::CloudFormation::Stack.create('rails_single_instance',
                                                     params[:EnvironmentName],
                                                     Dupondius.config.project_name,
                                                     stack_params)
    respond_with(result)
  end

  def available
    stacks = Dupondius::Aws::CloudFormation::STACKS
    respond_with(stacks.map { | name | { :name => name } })
  end

end
