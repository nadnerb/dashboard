require 'dupondius'
class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from Dupondius::Aws::Config::InvalidCredentials, :with => :bad_aws_credentials

  before_filter {
    headers['X-Refspec'] = Dupondius::Version.refspec
  }
  
  before_filter :can_we_haz

  private

  def bad_aws_credentials
    render :text => 'Invalid aws credentials', :status => 500
  end

# we are protected.
# goto your root (the dupondius home page) and run this.
#
#  $.cookie('u_can_haz', 'monkeysAndBananas', { expires: 365, path: '/' });
#
# you can now access everything again
  def can_we_haz
#    redirect_to("/404.html") unless cookies[:u_can_haz] == 'monkeysAndBananas' || params[:controller] == 'under_construction'
  end
end
