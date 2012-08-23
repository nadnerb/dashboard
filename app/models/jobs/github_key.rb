class GithubKey

  attr_reader :name

  def initialize(name, directory)
    @name = name
    @directory = directory
  end

  def create
    project = Project.find_by_name(name)
    client = Source::Github.new
    client.deploy_key
    # ssh-keygen -t rsa -q -f fooz_rsa -P foozie
    # create repo
    # add public key to their repo
    # push repo
    #GithubClient.create_repo(name, directory)
  end

  handle_asynchronously :create

  def key
    %q{ssh-rsa
AAAAB3NzaC1yc2EAAAABIwAAAQEAyrBOE3zDQMcoRi9no60foxqEy7EVmAARowko6rERDXCp5tKrY3dOpk0wDyuZgvvq2gfaVRaUuwo1AJwJk43sFb6ZVxRwNZLjIF2dFV+RjQKy1NnPd9ymrZacIOyQXLzFUWsM59JPA6v8zznF826RSBuQIIGESz9n0lhICfO4oIq62Bexllh9O/vU71EKnzFxqq2StNCd5q/tit7AK0GiHnm2OyufBQrGhUjVrCDmXx2X9XX77swHky56z4ZgZk1XdC4EEHE4WariMzryjBPldCXkQGq5x97IC35aeCCVcyDAkQ+5HRxJK/Ja2RYy8f5bsmYRcI06suWGePUQO48Bjw==
    }
  end
end
