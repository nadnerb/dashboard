class Dashboard::PerformanceController < ActionController::Base

  respond_to :json
  wrap_parameters :format => [:json]

  def show
    newrelic ? respond_with(newrelic) : respond_with({:not_configured => true })
  end

  def create
    respond_with(Dashboard::NewrelicConfiguration.create!(:token => params['token']), :location => dashboard_performance_path)
  end

  def newrelic
    @newrelic ||= newrelic = Dashboard::NewrelicConfiguration.first
  end
end
