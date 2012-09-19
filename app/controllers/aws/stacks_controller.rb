
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
      redirect_to :nothing => true, :status => 404
    end
  end

  def update
    stack = Dupondius::Aws::CloudFormation::Stack.find(params[:id])
    stack.update(params[:parameters])
    respond_with(stack)
  end

  def create
    full_name = params[:parameters][:EnvironmentName]
    full_name.concat("-#{params[:parameters][:UniqueName]}") if params[:parameters][:EnvironmentName] == 'dev'
    params[:parameters].delete(:UniqueName)
    result = Dupondius::Aws::CloudFormation::Stack.create('rails_single_instance',
                                                     full_name,
                                                     Dupondius.config.project_name,
                                                     params[:parameters])
    render :nothing => true, :status => 200
  end

  def destroy
    Dupondius::Aws::CloudFormation::Stack.find(params[:id]).delete
    render :nothing => true, :status => 200
  end

  def available
    stacks = Dupondius::Aws::CloudFormation::ENVIRONMENTS
    respond_with(stacks.map { | name | { :name => name } })
  end

end
