require 'dupondius'

class ProjectsController < ApplicationController
  respond_to :json

  def new

  end

  def create
    dashboard = Dupondius::Aws::Stacks::Dashboard.new(params[:name])
    puts dashboard.create({KeyName: 'team-brats', InstanceType: 't1.micro'})
    render :nothing => true
    #project = Project.create(params[:project])
    #respond_with(project, :status => :created)
  end

end
