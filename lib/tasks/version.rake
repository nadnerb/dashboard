require 'yaml'

desc 'Stamp the app with a version'
task :stamp_version do
  version = ENV['PIPELINE_BUILD_NUMBER'] || '0'
  git = ENV['GIT_COMMIT'] || ''
  build_date = ENV['BUILD_ID'] || ''
  File.open('config/version.yaml', 'w') do |io|
    YAML::dump({
      :version => "0.0.#{version}",
      :git_commit => git,
      :build_date => build_date
    }, io)
  end
end