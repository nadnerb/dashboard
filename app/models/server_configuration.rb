class ServerConfiguration < ActiveRecord::Base
  attr_accessible :newrelic_token, :newrelic_key
  #validates :newrelic_token, :presence => true

  def as_json(options={})
    {:id => id, :newrelic_token => newrelic_token, :newrelic_key => newrelic_key}
  end
end
