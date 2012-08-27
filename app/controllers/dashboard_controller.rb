class DashboardController < ApplicationController
    def index
        params[:project_name] = ENV['PROJECT_NAME']
    end

    def monkeys_and_bananas
        cookies[:u_can_haz] = { :value => 'monkeysAndBananas', :expires => Time.now + 9999999 }
        render :nothing => true
    end
end