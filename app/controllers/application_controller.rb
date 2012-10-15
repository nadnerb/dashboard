require 'dupondius'
class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter {
    headers['X-Refspec'] = Dupondius::Version.refspec
  }

end
