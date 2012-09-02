require 'pivotal_tracker'

class Dashboard::StoriesController < ActionController::Base

  def show
    one_and_only = Dashboard::PivotalTrackerConfiguration.first
    return render :json => { :not_configured => true } if one_and_only.nil?
    render :json => project(one_and_only)
  end

  def create
    one_and_only = Dashboard::PivotalTrackerConfiguration.create!({ :token => params['token'], :project_id => params['project_id'] })
    render :json => project(one_and_only)
  end

  private
  def project(one_and_only)
    PivotalTracker::Client.token = one_and_only[:token] # da4f9bf2587bd8b68bef789846b35b3d
    proj = PivotalTracker::Project.find(one_and_only[:project_id]) # 627145
    PivotalTracker::Iteration.current(proj)
  end
end
