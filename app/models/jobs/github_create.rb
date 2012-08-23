class Jobs::GithubCreate

  attr_reader :project

  def initialize(project_id, directory)
    @project = Project.find(project_id)
    @directory = directory
  end

  def create
    p "creating project on github: #{project.name}"
    p Source::Commands.new(project.token).create_repo(project.name)
    # ssh-keygen -t rsa -q -f fooz_rsa -P foozie
    # create repo
    # add public key to their repo
    # push repo
    #GithubClient.create_repo(name, directory)
  end

  handle_asynchronously :create
end
