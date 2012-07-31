class ProjectsController < ActionController::Base
  respond_to :json

  def create
    project = Project.create(params[:project])
    respond_with(project, :status => :created)
  end
end
