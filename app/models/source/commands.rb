require 'yajl'
class Source::Commands < SimpleDelegator

  attr_accessor :user, :token

  def initialize(token)
    #expensive, we may move this
    @user = Yajl.load(RestClient.get("https://api.github.com/user", :params => {:access_token => token}))
    @token = token
    super(client)
  end

  def create_repo(name)
    #client.create(name, {private: 'false'}).to_json
    create(name, {private: 'false'}).to_json
  end

  #def add_deploy_key
    #client.add_deploy_key
  #end

  #def user_info
    #@user_info ||= RestClient.get("https://api.github.com/user", :params => {:access_token => token})
    #Yajl.load(@user_info)
  #end

  private
  def client
    @client ||= Octokit::Client.new(:login => user['login'], :oauth_token => token)
  end
end
