class LaunchpadController < ApplicationController
    before_filter :authenticate_user!

    def index
      cookies.delete :project_data
      cookies.delete :project_id
      redirect_to new_project_url
    end

end