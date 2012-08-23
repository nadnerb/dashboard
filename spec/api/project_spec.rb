require "spec_helper"

describe "project", :type => :api do

  context "creating a project" do

    before do
      skeleton = mock(Jobs::Skeleton).as_null_object
      Jobs::Skeleton.should_receive(:new).and_return(skeleton)
    end

    let(:url) { "/projects" }

    it "sucessful as JSON" do
      post "#{url}.json", :project => {:name => "yo sup"}

      project = Project.find_by_name("yo sup")

      last_response.status.should eql(201)
      last_response.body.should eql(project.to_json)
    end

    it "unsuccessful as JSON" do
      post "#{url}.json", :project => {:github => :what}

      last_response.status.should eql(422)
      errors = {"errors" => {"name" => ["can't be blank"]}}.to_json
      last_response.body.should eql(errors)
    end
  end

end
