
class Aws::StacksController < ApplicationController

  respond_to :json

  def index
    respond_with(Dupondius::Aws::CloudFormation.summaries(project_name))
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

  def create

    # TODO: Move these system level parameter setup somewhere else
    stack_params = params[:stack].merge('AwsAccessKey' => Dupondius.config.access_key,
                 'AwsSecretAccessKey' => Dupondius.config.secret_access_key,
                 'KeyName' => 'team-brats')
    stack_params.delete('random')
    result = Dupondius::Aws::CloudFormation::Stack.create('rails_single_instance',
                                                     params[:EnvironmentName],
                                                     project_name,
                                                     stack_params)
  end

  def available
    stacks = Dupondius::Aws::CloudFormation::STACKS
    respond_with(stacks.map { | name | { :name => name } })
  end

end
