require 'spec_helper'

describe SourcesController do

  let(:client) do
    client = mock(Source::Github)
    Source::Github.should_receive(:new).and_return(client)
    client
  end

  describe "GET 'new'" do
    it "should authorise via github" do

      client.should_receive(:authorize).and_return('foo')

      get 'new'
      response.should redirect_to 'foo'
    end
  end

  describe "GET 'callback'" do
    it "should authorise token via github" do

      token = mock('token')
      client.should_receive(:get_token).and_return(token)
      token.should_receive('token').and_return('the goods')
      client.should_receive(:user_info_for).with('the goods').and_return({'login' => 'login name'})

      get 'callback', {code: 'codes'}

      response.should redirect_to :new_projects
      session[:github_user].should == 'login name'
      session[:token].should == 'the goods'
    end

    describe 'oauth error' do
      before do
        mock_response = mock().as_null_object
        client.stub(:get_token) { raise OAuth2::Error.new(mock_response) }
      end

      it 'should render error message' do
        get 'callback', {code: 'codes'}
        expect(response.body).to eq('PANIC')
      end

    end
  end

end
