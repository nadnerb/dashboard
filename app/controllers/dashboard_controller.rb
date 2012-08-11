class DashboardController < ActionController::Base
  #wtf?
  layout "application"

  def show
    params[:application_name] = 'My App'
  end
end
