class DashboardController < ApplicationController
#    before_filter :authenticate_user!, :except => [:monkeys_and_bananas]

    def index
        params[:project_name] = ENV['PROJECT_NAME']
    end

    def monkeys_and_bananas
        cookies[:u_can_haz] = { :value => 'monkeysAndBananas', :expires => Time.now + 9999999 }
        render :nothing => true
    end
end