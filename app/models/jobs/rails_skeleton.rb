class Jobs::RailsSkeleton

  attr_reader :project, :resting_place

  def initialize(project, resting_place)
    @project = project
    @resting_place = resting_place
  end

  def run
    p "building rails environment: #{resting_place} for project: #{project.name}"
    p `cd #{resting_place} && scrolls new #{project.name} -s capistrano unicorn rspec git rubyracer 2>&1`
  end
end
