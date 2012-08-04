class DashboardController < ActionController::Base
  #wtf?
  layout "application"

  def show
    flash.now[:notice] = "Dashboard - from dupondi.us"
  end
end
