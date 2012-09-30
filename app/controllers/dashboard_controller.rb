class DashboardController < ApplicationController
  before_filter :authenticate_user!

  def index
    params[:project_name] = ENV['PROJECT_NAME']
    params[:project_github_user] = ENV['PROJECT_GITHUB_USER']
    params[:project_github_project] = ENV['PROJECT_NAME'] == 'dupondius' ? 'dashboard' : ENV['PROJECT_NAME']
  end

end
