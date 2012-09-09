class Jobs::Skeleton

  attr_reader :project

  def initialize(project_id)
    @project = Project.find(project_id)
  end

  def run
    p project
    project.tech_stack == 'Grails' ? GrailsSkeleton.new(project, resting_place).run : RailsSkeleton.new(project, resting_place).run
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
