require 'dupondius'

class ProjectsController < ApplicationController

  respond_to :json

  def new
  end

  def show
    @project = Project.find(params[:id])
  end

  def create
    project = Project.create(params[:project].except(:github, :tech_stack, :support, :environments))
    Jobs::Skeleton.new(project.id).run if Rails.configuration.launchpad_jobs
    Jobs::LaunchCi.new(project, params).run if Rails.configuration.aws_enabled && params[:project][:support].include?('Jenkins')
    respond_with(project, :location => :projects)
  end

end
