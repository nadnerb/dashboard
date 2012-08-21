require 'dupondius'

class ProjectsController < ApplicationController

  respond_to :json

  def new
  end

  def show
    @project = Project.find(params[:id])
  end

  def create
    project = Project.create(params[:project])
    #Jobs::Skeleton.new(params[:project][:name]).build
    respond_with(project, :location => :projects)
  end

end
