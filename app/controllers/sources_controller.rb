class SourcesController < ActionController::Base
  rescue_from OAuth2::Error, :with => :oauth_error

  before_filter :client

  def new
    redirect_to client.authorize
  end

  def callback
    token = client.get_token(params[:code]).token
    render :text => "CODEZ! #{token}"
  end

  private
  def client
    @client ||= Source::Github.new
  end

  def oauth_error
    render :text => "PANIC"
  end
end
