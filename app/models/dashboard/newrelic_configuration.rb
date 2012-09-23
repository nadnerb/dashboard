class Dashboard::NewrelicConfiguration < ActiveRecord::Base
  attr_accessible :iframe
  validates :iframe, :presence => true

  def self.create_from_performance_param!(performance)
    Dashboard::NewrelicConfiguration.create!(:iframe => src(performance[:iframe]))
  end

  def self.src(iframe_url)
    iframe_url = iframe.match(/src=['"]([^']*)['"]/)[1] if iframe =~ /src=/
    nil unless is_url? iframe_url
  end

  def self.is_url?(url)
    url =~ /https?:\/\/[\S]+/
  end
end
