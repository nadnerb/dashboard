require 'fileutils'

class Jobs::GrailsSkeleton

  attr_reader :project, :resting_place

  def initialize(project, resting_place)
    @project = project
    @resting_place = resting_place
  end

  def run
    p "building grails environment: #{resting_place} for project: #{project.name}"
    FileUtils.cd(resting_place, :verbose => true) do
      p `curl -u 'dupondius:4nalienatemybaby' -L -o grails.tar.gz https://api.github.com/repos/uglyog/dupondius-grails-skeleton/tarball;\
      tar xfz grails.tar.gz;\
      mv \`ls -d -- */\` #{project.name}`
      FileUtils.cd(project.name, :verbose => true) do
        `sed 's/\\(app\\.name=\\).*/\\1#{project.name}/' application.properties > application.properties.sed;\
        mv application.properties.sed application.properties;\
        git init;\
        git add .;\
        git commit --author='dupondi.us <team@dupondi.us>' -m 'Initial commit'`
      end
    end
  end
end
