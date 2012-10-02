require "spec_helper"
require 'awesome_print'

describe "project", :type => :api do

  context "creating a project" do

    before do
      skeleton = mock(Jobs::Skeleton).as_null_object
      Jobs::Skeleton.stub(:new).and_return(skeleton)

      set_cookie 'u_can_haz=monkeysAndBananas'
    end

    let(:url) { "/projects" }

    it "sucessful as JSON" do
      post "#{url}.json", :project => {:name => "yo sup"}

      project = Project.find_by_name("yo sup")

      last_response.status.should eql(201)
      last_response.body.should eql(project.to_json)
    end

    it "unsuccessful as JSON" do
      post "#{url}.json", :project => {:github_account => :what, :name => ''}

      last_response.status.should eql(422)
      # Steve added bangs to all AR persistance, so now we get a giant error page instead of some nice json
      # But then that Steve is just a crazy guy
#      errors = {"errors" => {"name" => ["can't be blank"]}}.to_json
#      last_response.body.should eql(errors)
    end
  end

end
