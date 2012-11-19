require 'dupondius'

class ProjectsController < ApplicationController

  respond_to :json

  def new
    render :layout => false
  end

  def show
    @project = Project.find(params[:id])
    render :layout => false
  end

  def create
    github_private = params[:project][:github_private] ? true : false
    project = Project.create!(params[:project].except(:support, :github_private).merge(:github_private => github_private))
    respond_with(project, :location => :projects)
  end

end
