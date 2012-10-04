require 'pivotal_tracker'

class Dashboard::StoriesController < ActionController::Base

  def show
    one_and_only = Dashboard::PivotalTrackerConfiguration.first
    return render :json => { :not_configured => true } if one_and_only.nil?
    render :json => iteration(one_and_only)
  end

  def create
    one_and_only = Dashboard::PivotalTrackerConfiguration.create!({ :token => params['token'], :project_id => params['project_id'] })
    render :json => iteration(one_and_only)
  end

  def velocity
    one_and_only = Dashboard::PivotalTrackerConfiguration.first
    return render :json => { :not_configured => true } if one_and_only.nil?
    render :json => project(one_and_only)
  end

  private
  def iteration(config)
    PivotalTracker::Iteration.current(pivotal(config).project)
  end

  def project(config)
    PivotalTracker::Project.find(pivotal(config).project.id)
  end

  def pivotal config
    @pivotal ||= Pivotal.new config
  end
end
