class Dashboard::NewrelicConfiguration < ActiveRecord::Base
  attr_accessible :source
  validates :source, :presence => true
  validate :is_iframe?

  def is_url?(url)
    /https?:\/\/[\S]+/.match(url).present?
  end

  def is_iframe?
    unless source =~ /^<iframe/ && source =~ /src=/
      errors.add(:source, "Invalid new relic graph configuration, please post an iframe")
    else
      iframe_url = source.match(/src=['"]([^['"]]*)['"]/)[1]
      errors.add(:source, "IFRAME source url is invalid") unless is_url? iframe_url
    end
  end
end
