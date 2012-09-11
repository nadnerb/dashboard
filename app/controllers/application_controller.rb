require 'dupondius'
class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from Dupondius::InvalidCredentials, :with => :bad_aws_credentials

  before_filter {
    headers['X-Refspec'] = Dupondius::Version.refspec
  }

  def project_name
    Rails.configuration.project_name
  end

  private

  def bad_aws_credentials
    render :text => 'Invalid aws credentials', :status => 500
  end

end
