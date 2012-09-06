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
    @newrelic ||= begin
                    nr = Dashboard::NewrelicConfiguration.first
                    return nil if nr.nil?
                    response = Curl::Easy.perform("https://api.newrelic.com/application_dashboard") do |curl|
                      curl.headers["x-api-key"] = nr.token
                    end
                    nr.content = response.body_str
                  rescue => e
                    nr.content = "We could not query the new relic api, please make sure you are connected to the internet and have entered the correct api token"
                  ensure
                    return nr
                  end
  end
end
