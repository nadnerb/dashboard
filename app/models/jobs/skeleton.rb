class Jobs::Skeleton

  attr_reader :name

  def initialize(name)
    @name = name
  end

  def build
    `cd #{resting_place}; scrolls new #{name} -s capistrano unicorn rspec git`
  end

  def resting_place
    @resting_place ||= begin
                        FileUtils.mkdir_p("#{Dir.tmpdir}/#{name}_#{Time.now.to_i}/").first
                      end
  end

  handle_asynchronously :build
end
