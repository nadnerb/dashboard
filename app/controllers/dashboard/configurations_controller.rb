class Dashboard::ConfigurationsController < ApplicationController

  respond_to :json

  def new
    respond_with ServerConfigruation.new
  end

  def export
    # TODO: This key should come from the DB
    render :text => 'NEW_RELIC_LICENSE_KEY=2c289743107b162195947d99c59004fc4fa06dc2'
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
