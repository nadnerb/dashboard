class Project < ActiveRecord::Base
  attr_accessible :name, :token, :tech_stack

  validates_presence_of :name

  after_create :launch_dashboard

  def launch_dashboard
    # temporarily guard the creation of aws resources
    if Rails.configuration.aws_enabled
      Dupondius::Aws::CloudFormation::Dashboard.create(self.name, {
          KeyName: 'team-brats',
          InstanceType: 'm1.small',
          AwsAccessKey: Dupondius.config.access_key,
          AwsSecretAccessKey: Dupondius.config.secret_access_key,
          DBName: 'dashboard',
          DBUsername: 'dashboard',
          DBPassword: 'dashboard',
          DBRootPassword: 'r00tr00t'
      })
    end
  end

  handle_asynchronously :launch_dashboard

  def dashboard
    @dashboard ||= Dupondius::Aws::CloudFormation::Dashboard.find(self.name)
  end

end
