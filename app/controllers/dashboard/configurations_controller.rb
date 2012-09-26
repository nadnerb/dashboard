class Dashboard::ConfigurationsController < ApplicationController

  respond_to :json

  def new
    respond_with ServerConfigruation.new
  end

  def show
    configuration = ServerConfiguration.find_by_id(params[:id]) || ServerConfiguration.last
    if configuration
      respond_with(configuration)
    else
      respond_with ServerConfiguration.new
    end
  end

  def create
    configuration = ServerConfiguration.new(params[:configuration])
    if configuration.save
      respond_with(configuration, :location => dashboard_performance_path)
    else
      render :json => { :invalid => 'Invalid server configuration' }
    end
  end

  def update
    configuration = ServerConfiguration.find(params[:id])
    if configuration.update_attributes(params[:configuration])
      respond_with(configuration, :location => dashboard_performance_path)
    else
      render :json => { :invalid => configuartion.errors }
    end
  end
end
