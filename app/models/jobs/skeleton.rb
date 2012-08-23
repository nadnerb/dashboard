class Jobs::Skeleton

  attr_reader :project_id

  def initialize(project_id)
    @project_id = project_id
  end

  def build
    p "building: #{resting_place}"
    p `cd #{resting_place}; scrolls new #{name} -s capistrano unicorn rspec git 2>&1`
    # will move this to super job associated with a project
    Jobs::GithubCreate.new(name, resting_place).create
  end

  def resting_place
    @resting_place ||= begin
                        FileUtils.mkdir_p("#{Dir.tmpdir}/skeletons/#{name}_#{Time.now.to_i}/").first
                        #FileUtils.mkdir_p("#{Rails.root}/skeletons/#{name}_#{Time.now.to_i}/").first
                      end
  end

  handle_asynchronously :build
end
