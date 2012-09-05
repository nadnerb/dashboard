class Dashboard::NewrelicConfiguration < ActiveRecord::Base
  attr_accessible :token
  attr_accessor :content

  def as_json(options={})
    { :token => self.token, :content => self.content }
  end
end
