require 'yajl'

class Jobs::LaunchCi

  attr_reader :project, :params

  def initialize(project, params)
    @project = project
    @params = params
  end

  def run
    puts "---> LauchCi"
    user = Source::Commands.new(@project.token).user['login']
    options = {
        KeyName: 'team-brats',
        InstanceType: 'm1.small',
        ProjectGithubUser: user.to_s,
        ProjectType: tech_stack(params[:project][:tech_stack]).to_s
    }
    Dupondius::Aws::Stacks::ContinuousIntegration.create(@project.name, options)
    puts "LauchCi <---"
  end

  def tech_stack(tech)
    case tech
      when 'Ruby on Rails' then 'rails'
      else
        'rails'
    end
  end

  handle_asynchronously :run
end
