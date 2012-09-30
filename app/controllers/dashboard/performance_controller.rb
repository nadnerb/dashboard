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

#  def destroy
#    begin
#      Dashboard::NewrelicConfiguration.find(params[:id]).destroy
#    rescue
#    end
#    render :json => { :not_configured => true }
#  end
#
#  def newrelic
#    # TODO allow multiple
#    @newrelic ||= Dashboard::NewrelicConfiguration.last
#  end

  def summary
    configuration = ServerConfiguration.first
    response = HTTParty.get('https://api.newrelic.com/application_dashboard', :headers => {"x-api-key" => configuration.newrelic_token})
    render :text => response.body
  end
end
