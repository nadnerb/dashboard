require 'curl'

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
                    nr = Dashboard::NewrelicConfiguration.first
                    response = Curl::Easy.perform("https://api.newrelic.com/application_dashboard") do |curl|
                      curl.headers["x-api-key"] = nr.token
                    end
                    nr.content = response.body_str
                    nr
                  end
  end
end
