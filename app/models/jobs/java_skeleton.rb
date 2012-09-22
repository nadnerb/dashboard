class Jobs::GrailsSkeleton

  attr_reader :project, :resting_place

  def initialize(project, resting_place)
    @project = project
    @resting_place = resting_place
  end

  def run
    p "building java environment: #{resting_place} for project: #{project.name}"
    p `cd #{resting_place};\
    mvn archetype:generate -B -DarchetypeGroupId=org.appfuse.archetypes -DarchetypeArtifactId=appfuse-light-wicket-archetype -DarchetypeVersion=2.1.0 -DgroupId=dupondi.us -DartifactId=#{project.name} -DarchetypeRepository=http://oss.sonatype.org/content/repositories/appfuse\
    git init;\
    git add .;\
    git commit -m 'Initial commit'`
  end
end
