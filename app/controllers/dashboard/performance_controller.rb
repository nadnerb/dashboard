require 'curl'

class Dashboard::PerformanceController < ActionController::Base

  respond_to :json

  def show
    newrelic ? respond_with(newrelic) : respond_with({:not_configured => true })
  end

  def create
    Dashboard::NewrelicConfiguration.create!(params['performance'])
    respond_with(newrelic, :location => dashboard_performance_path)
  end

  def destroy
    begin
      Dashboard::NewrelicConfiguration.find(params[:id]).destroy
    rescue
    end
    render :json => { :not_configured => true }
  end

  def newrelic
    # allow multiple
    @newrelic ||= Dashboard::NewrelicConfiguration.last
  end
end
