require "spec_helper"

describe "project", :type => :api do

  context "creating a project" do

    let(:url) { "/projects" }

    it "sucessful as JSON" do
      post "#{url}.json", :project => { :name => "yo sup" }

      project = Project.find_by_name("yo sup")
      route = "/projects/#{project.id}"

      last_response.status.should eql(201)
      last_response.body.should eql(project.to_json)
    end

    it "unsuccessful as JSON" do
      post "#{url}.json", :project => {}

      last_response.status.should eql(422)
      errors = {"errors" => {"name" => ["can't be blank"]}}.to_json
      last_response.body.should eql(errors)
    end
  end

end
