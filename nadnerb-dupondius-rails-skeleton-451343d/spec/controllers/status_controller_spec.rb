require 'spec_helper'

describe StatusController do

  describe "GET 'heart_beat'" do
    it "returns http success" do
      get 'heart_beat'
      response.should be_success
    end
  end

  describe "GET 'version'" do
    it "returns http success" do
      get 'version'
      response.should be_success
    end
  end

end
