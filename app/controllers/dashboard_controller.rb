class DashboardController < ActionController::Base
  #wtf?
  layout "application"

  def index
    params[:application_name] = 'My App'
  end

  def stories
    params[:application_name] = 'My App'
  end

  def builds
    params[:application_name] = 'My App'
  end

  def performance
    params[:application_name] = 'My App'
  end

  def source
    params[:application_name] = 'My App'
  end

  def configure
    params[:application_name] = 'My App'
  end
end
