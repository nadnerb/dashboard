class Jobs::GithubCreate

  attr_reader :name

  def initialize(name, directory)
    @name = name
    @directory = directory
  end

  def create
    project = Project.find_by_name(name)
    p "creating project on github: #{project.name}"
    p Source::Commands.new(project.token).create_repo(name)
    # ssh-keygen -t rsa -q -f fooz_rsa -P foozie
    # create repo
    # add public key to their repo
    # push repo
    #GithubClient.create_repo(name, directory)
  end

  handle_asynchronously :create
end
