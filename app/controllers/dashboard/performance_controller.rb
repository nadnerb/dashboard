class Dashboard::PerformanceController < ActionController::Base

  respond_to :json

  def show
    newrelic ? respond_with(newrelic) : respond_with({:not_configured => true })
  end

  def create
    respond_with(Dashboard::NewrelicConfiguration.create!(params['performance']), :location => dashboard_performance_path)
  end

  def newrelic
    @newrelic ||= begin
                    Dashboard::NewrelicConfiguration.first
                  end
  end
end
