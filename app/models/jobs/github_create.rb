class Jobs::GithubCreate

  attr_reader :project, :resting_place

  def initialize(project_id, resting_place)
    @project = Project.find(project_id)
    @resting_place = resting_place
  end

  def run
    p "creating project on github: #{project.name}"
    p Source::Commands.new(project.token).create_repo(project.name, project.github_private)
    Jobs::GithubKey.new(project.id, resting_place).run
  end

  handle_asynchronously :run
end
