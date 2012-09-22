class DashboardController < ApplicationController
    before_filter :authenticate_user!

    def index
        params[:project_name] = ENV['PROJECT_NAME']
    end

end