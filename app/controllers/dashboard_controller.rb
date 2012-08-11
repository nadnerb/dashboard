class DashboardController < ActionController::Base
  #wtf?
  layout "application"

  def show
    params[:application_name] = 'Workflow'
  end
end
