class Skeleton

  def build(name)
    p "building skeleton #{name}"
    # we cannot run scrolls within an existing rails app
    # we could create a temp dir or something here
    `cd ..; scrolls new #{name} -s capistrano mysql unicorn rspec github`
  end

  handle_asynchronously :build
end
