require 'dupondius'
class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from Dupondius::Aws::Config::InvalidCredentials, :with => :bad_aws_credentials

  before_filter {
    headers['X-Refspec'] = Dupondius::Version.refspec
  }

  private

  def bad_aws_credentials
    render :text => 'Invalid aws credentials', :status => 500
  end

end
