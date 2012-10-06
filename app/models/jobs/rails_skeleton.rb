class Jobs::RailsSkeleton

  attr_reader :project, :resting_place

  def initialize(project, resting_place)
    @project = project
    @resting_place = resting_place
  end

  def run
    #p "building rails environment: #{resting_place} for project: #{project.name}"
    #p `cd #{resting_place} && scrolls new #{project.name} -s capistrano unicorn rspec git rubyracer 2>&1`
    p "building rails environment: #{resting_place} for project: #{project.name}"
    p `cd #{resting_place};\
    curl -u 'dupondius:4nalienatemybaby' -L -o rails.tar.gz https://api.github.com/repos/nadnerb/dupondius-rails-skeleton/tarball;\
    tar xfz rails.tar.gz;\
    mv \`ls -d -- */\` #{project.name};\
    cd #{project.name};\
    git init;\
    git add .;\
    git commit --author='dupondi.us <team@dupondi.us>' -m 'Initial commit'`
  end
end
