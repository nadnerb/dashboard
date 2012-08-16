class Source::Github

  def initialize(client_id = '96dad6e6b00da1bac9a5', secret = '4ccb97caa0a26f39399baeb0399d1689828adac6')
    @client_id = client_id
    @secret = secret
  end

  def oauth_url
    'https://github.com'
  end

  def get_token(code)
    client.auth_code.get_token(code)
  end

  def authorize
    url = authorize_url
    puts "Redirecting to URL: #{url.inspect}"
    url
  end

  def state
    @state ||= Digest::SHA1.hexdigest(rand(36**8).to_s(36))
  end

  def scopes
    ['repo']
  end

  private
  def client
    @client ||= OAuth2::Client.new(@client_id, @secret,
                                   :site          => oauth_url,
                                   :token_url     => '/login/oauth/access_token',
                                   :authorize_url => '/login/oauth/authorize')
  end

  def authorize_url
    client.auth_code.authorize_url(
      :state        => state,
      :scope        => scopes
      #:redirect_uri => redirect_uri
    )
  end

  #def redirect_uri(path = '/auth/github/callback', query = nil)
    #uri = URI.parse(request.url)
    #uri.path  = path
    #uri.query = query
    #uri.to_s
  #end
end
