class Project < ActiveRecord::Base
  attr_accessible :name, :token

  validates_presence_of :name

  #after_create :launch_dashboard

  def launch_dashboard
    Dupondius::Aws::Stacks::Dashboard.create(self.name, {KeyName: 'team-brats',
                                                         InstanceType: 't1.micro'})
  end

  #handle_asynchronously :launch_dashboard

  def dashboard
    @dashboard ||= Dupondius::Aws::Stacks::Dashboard.find(self.name)
  end

end
