class CreateGithubJob

  attr_reader :name

  def initialize(name, directory)
    @name = name
    @directory = directory
  end

  def create
    # ssh-keygen -t rsa -q -f fooz_rsa -P foozie
    # create repo
    # add public key to their repo
    # push repo
    #GithubClient.create_repo(name, directory)
  end

  handle_asynchronously :create
end
