class ProjectsController < ActionController::Base
  respond_to :json

  def create
    project = Project.create(params[:project])
    respond_with(project, :status => :created)
  end

  def new
    # we cannot run scrolls within an existing rails app
    `cd ..; scrolls new project_name_goes_here -s capistrano mysql unicorn rspec github`
    render :text => "Created new project project_name_goes_here"
  end
end
