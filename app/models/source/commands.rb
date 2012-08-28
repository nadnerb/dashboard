require 'yajl'
require 'octokit'

class Source::Commands < SimpleDelegator

  attr_accessor :user, :token

  def initialize(token)
    #expensive, we may move this
    @user = Yajl.load(RestClient.get("https://api.github.com/user", :params => {:access_token => token}))
    @token = token
    super(client)
  end

  def create_repo(name)
    #create(name, {private: 'false'}).to_json
    #doesn't like the private flag even though i have used it in the past wtf its too late my head hurts just pretend i don't care blah blahbbbb
    create(name).to_json
  end

  private
  def client
    @client ||= Octokit::Client.new(:login => user['login'], :oauth_token => token)
  end
end
