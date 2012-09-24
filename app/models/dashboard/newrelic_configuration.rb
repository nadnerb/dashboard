class Dashboard::NewrelicConfiguration < ActiveRecord::Base
  attr_accessible :source
  validates :source, :presence => true

  def self.build_from_performance_param!(performance)
    Dashboard::NewrelicConfiguration.new(:source => src(performance[:iframe]))
  end

  def self.src(iframe_url)
    iframe_url = iframe_url.match(/src=['"]([^['"]]*)['"]/)[1] if iframe_url =~ /src=/
    is_url?(iframe_url) ? iframe_url : nil
  end

  def self.is_url?(url)
    /https?:\/\/[\S]+/.match(url).present?
  end
end
