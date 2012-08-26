class Jobs::GithubPush

  attr_reader :project, :resting_place, :username

  def initialize(project_id, resting_place, username)
    @project = Project.find(project_id)
    @resting_place = resting_place
    @username = username
  end

  def run
    p "pushing project"
    `cd #{resting_place}/#{project.name};\
    git remote add origin git@github.com:#{username}/#{project.name}.git;\
    ssh-agent bash -c 'ssh-add ../#{project.name}_rsa; git push origin master'`
    #`git remote add origin https://github.com/#{username}/#{project.name}.git`
  end

  handle_asynchronously :run
end
