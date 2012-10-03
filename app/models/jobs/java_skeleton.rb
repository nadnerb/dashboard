class Jobs::JavaSkeleton

  attr_reader :project, :resting_place

  def initialize(project, resting_place)
    @project = project
    @resting_place = resting_place
  end

  def run
    p "building java environment: #{resting_place} for project: #{project.name}"
    p `cd #{resting_place};\
    mvn archetype:generate -B -DarchetypeGroupId=org.appfuse.archetypes -DarchetypeArtifactId=appfuse-modular-spring-archetype -DarchetypeVersion=2.1.1-SNAPSHOT -DgroupId=us.dupondi -DartifactId=#{project.name} -DarchetypeRepository=http://oss.sonatype.org/content/repositories/appfuse;\
    cd #{project.name};\
    git init;\
    git add .;\
    git commit --author='dupondi.us <commiter@dupondi.us>' -m 'Initial commit'`
  end
end
