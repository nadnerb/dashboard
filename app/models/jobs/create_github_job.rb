class CreateGithubJob

  attr_reader :name

  def initialize(name, directory)
    @name = name
    @directory = directory
  end

  def create
    GithubClient.create_repo(name, directory)
  end

  handle_asynchronously :create
end
