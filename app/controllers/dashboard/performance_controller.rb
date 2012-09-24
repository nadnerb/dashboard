require 'curl'

class Dashboard::PerformanceController < ActionController::Base

  respond_to :json

  def show
    newrelic ? respond_with(newrelic) : respond_with({:not_configured => true })
  end

  def create
    _newrelic = Dashboard::NewrelicConfiguration.build_from_performance_param!(params['performance'])
    if _newrelic.save
      respond_with(newrelic, :location => dashboard_performance_path)
    else
      render :json => { :invalid => 'Invalid new relic configuration, please post an iframe or the graph url' }
    end
  end

  def destroy
    begin
      Dashboard::NewrelicConfiguration.find(params[:id]).destroy
    rescue
    end
    render :json => { :not_configured => true }
  end

  def newrelic
    # TODO allow multiple
    @newrelic ||= Dashboard::NewrelicConfiguration.last
  end
end
