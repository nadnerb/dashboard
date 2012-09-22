class Jobs::Skeleton

  attr_reader :project

  def initialize(project_id)
    @project = Project.find(project_id)
  end

  def run
    case project.tech_stack
      when 'Grails'
        Jobs::GrailsSkeleton.new(project, resting_place).run
      when 'Java'
        Jobs::JavaSkeleton.new(project, resting_place).run
      else
        Jobs::RailsSkeleton.new(project, resting_place).run
    end
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
