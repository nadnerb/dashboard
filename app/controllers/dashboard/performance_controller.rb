require 'httparty'

class Dashboard::PerformanceController < ActionController::Base

  respond_to :json

  def index
    respond_with Dashboard::NewrelicConfiguration.all
  end

  def show
    respond_with(Dashboard::NewrelicConfiguration.find(params[:id]))
  end

  def create
    newrelic = Dashboard::NewrelicConfiguration.new(:source => params[:source])
    if newrelic.save
      respond_with(newrelic, :location => dashboard_performance_url(newrelic.id))
    else
      render :json => newrelic.errors.full_messages, :status => 422
    end
  end

  def destroy
    chart = Dashboard::NewrelicConfiguration.find(params[:id])
    if chart
      chart.destroy
      render :json => 'OK'
    else
      render :status => 404
    end
  end

  def summary
    configuration = ServerConfiguration.first
    if configuration.newrelic_token
      response = HTTParty.get('https://api.newrelic.com/application_dashboard', :headers => {"x-api-key" => configuration.newrelic_token})
      render :text => response.body
    else
      render :text => ''
    end
  end
end
