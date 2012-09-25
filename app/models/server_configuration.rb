class ServerConfiguration < ActiveRecord::Base
  attr_accessible :new_relic_token
  validates :new_relic_token, :presence => true
end
