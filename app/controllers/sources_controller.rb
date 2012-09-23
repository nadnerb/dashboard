class SourcesController < ApplicationController
  rescue_from OAuth2::Error, :with => :oauth_error

  before_filter :client

  def new
    redirect_to client.authorize
  end

  def callback
    token = client.get_token(params[:code]).token
    user = client.user_info_for(token)

    session[:github_user] = user['login']
    session[:token] = token
    redirect_to :new_project
  end

  private
  def client
    @client ||= Source::Security.new
  end

  def oauth_error
    render :text => "Cannot authenticate using github oauth"
  end
end
