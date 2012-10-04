class Pivotal

  attr_reader :project

  def initialize config
    PivotalTracker::Client.token = config[:token] # da4f9bf2587bd8b68bef789846b35b3d
    @project = PivotalTracker::Project.find(config[:project_id]) # 627145
  end
end
