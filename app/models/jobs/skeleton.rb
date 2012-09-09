class Jobs::Skeleton

  attr_reader :project, :type

  def initialize(project_id, type)
    @project = Project.find(project_id)
    @type = type
  end

  def run
    RailsSkeleton.new(project, resting_place).run
    Jobs::GithubCreate.new(project.id, resting_place).run
  end

  def resting_place
    @resting_place ||= begin
                        FileUtils.mkdir_p("#{Dir.tmpdir}/skeletons/#{project.name}_#{Time.now.to_i}/").first
                        # this blows
                        #FileUtils.mkdir_p("#{Rails.root}/skeletons/#{name}_#{Time.now.to_i}/").first
                      end
  end

  handle_asynchronously :run
end
