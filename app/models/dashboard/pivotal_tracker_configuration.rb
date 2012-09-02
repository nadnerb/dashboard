class Dashboard::PivotalTrackerConfiguration < ActiveRecord::Base
  attr_accessible :token, :project_id
end
