class Jobs::GithubCreate

  attr_reader :project, :resting_place

  def initialize(project_id, resting_place)
    @project = Project.find(project_id)
    @resting_place = resting_place
  end

  def run
    p "creating project on github: #{project.name}"
    p Source::Commands.new(project.token).create_repo(project.name)
    # ssh-keygen -t rsa -q -f fooz_rsa -P foozie
    # create repo
    # add public key to their repo
    # push repo
    #GithubClient.create_repo(name, directory)
    Jobs::GithubKey.new(project.id, resting_place).run
  end

  handle_asynchronously :run
end
