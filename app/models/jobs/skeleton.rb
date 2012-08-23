class Jobs::Skeleton

  attr_reader :project

  def initialize(project_id)
    @project = Project.find(project_id)
  end

  def build
    p "building: #{resting_place} for project: #{project.name}"
    p `cd #{resting_place}; scrolls new #{project.name} -s capistrano unicorn rspec git 2>&1`
    # will move this to super job associated with a project
    Jobs::GithubCreate.new(project.id, resting_place).create
  end

  def resting_place
    @resting_place ||= begin
                        FileUtils.mkdir_p("#{Dir.tmpdir}/skeletons/#{project.name}_#{Time.now.to_i}/").first
                        # this blows
                        #FileUtils.mkdir_p("#{Rails.root}/skeletons/#{name}_#{Time.now.to_i}/").first
                      end
  end

  handle_asynchronously :build
end
