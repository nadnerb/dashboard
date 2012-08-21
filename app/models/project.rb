class Project < ActiveRecord::Base
  attr_accessible :name

  validates_presence_of :name

  after_create :launch_dashboard

  def launch_dashboard
    Dupondius::Aws::Stacks::Dashboard.create(self.name, {KeyName: 'team-brats', InstanceType: 't1.micro'})
  end

  handle_asynchronously :launch_dashboard

  def dashboard
    @dashboard ||= begin
      d = Dupondius::Aws::Stacks::Dashboard.find(self.name)
      d if d.stack.exists?
    end
  end

end
