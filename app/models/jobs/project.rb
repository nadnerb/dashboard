class Jobs::GithubCreate

  attr_reader :project

  def initialize(project_id)
    @project_id = project_id
  end

  def run
    skeleton = Jobs::Skeleton.new(project.id)
    skeleton.run
  end

  handle_asynchronously :run
end
