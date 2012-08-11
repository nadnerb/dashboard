class ProjectsController < ActionController::Base
  respond_to :json

  def create
    project = Project.create(params[:project])
    respond_with(project, :status => :created)
  end

  def new
    Skeleton.new.build('project_name_goes_here')
    render :text => "Created new project project_name_goes_here"
  end
end
