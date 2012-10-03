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

  def create_repo(name, private, description)
    # strange issue where have error if provide false for private repo's
    create_result = private ? create(name, {:description => description, :private => 'true'}) : create(name, {:description => description})
    p add_collaborator("#{@user['login']}/#{name}", "dupondius")
    create_result.to_json
  end

  private
  def client
    @client ||= Octokit::Client.new(:login => user['login'], :oauth_token => token)
  end
end
