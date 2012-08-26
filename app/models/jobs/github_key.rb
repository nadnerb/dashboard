require 'etc'

class Jobs::GithubKey

  attr_reader :project, :resting_place

  def initialize(project_id, resting_place)
    @project = Project.find(project_id)
    @resting_place = resting_place
  end

  def run
    # we will need to delete this and you will not be able to do it on an account already using this key
    p "deploykey for: #{project.name}"
    commands = Source::Commands.new(project.token)
    p commands.add_deploy_key({username: commands.user['login'], repo: project.name}, 'deploykey', key)
    Jobs::GithubPush.new(project.id, resting_place, commands.user['login']).run
  end

  handle_asynchronously :run

  def key
    `ssh-keygen -t rsa -q -f #{resting_place}/#{project.name}_rsa -N ''`
    open("#{resting_place}/#{project.name}_rsa.pub").read
    #open(Etc.getpwuid.dir + '/.ssh/id_rsa.pub').read
    #open(ENV['HOME']+'/.ssh/id_rsa.pub').read
    #%q{ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAyrBOE3zDQMcoRi9no60foxqEy7EVmAARowko6rERDXCp5tKrY3dOpk0wDyuZgvvq2gfaVRaUuwo1AJwJk43sFb6ZVxRwNZLjIF2dFV+RjQKy1NnPd9ymrZacIOyQXLzFUWsM59JPA6v8zznF826RSBuQIIGESz9n0lhICfO4oIq62Bexllh9O/vU71EKnzFxqq2StNCd5q/tit7AK0GiHnm2OyufBQrGhUjVrCDmXx2X9XX77swHky56z4ZgZk1XdC4EEHE4WariMzryjBPldCXkQGq5x97IC35aeCCVcyDAkQ+5HRxJK/Ja2RYy8f5bsmYRcI06suWGePUQO48Bjw==}
  end
end
