class HomeController < ApplicationController
  def index
    flash.now[:notice] = "Welcome! - from dupondi.us"
  end
end
