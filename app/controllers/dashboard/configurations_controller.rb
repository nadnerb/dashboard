class Dashboard::ConfigurationsController < ApplicationController

  respond_to :json

  def new
    respond_with ServerConfigruation.new
  end

  def export
    render :text => ["NEW_RELIC_LICENSE_KEY=#{ServerConfiguration.first.newrelic_key}",
                     "PROJECT_GITHUB_USER=#{ENV['PROJECT_GITHUB_USER']}",''].join("\n")

  rescue
    render :nothing => true
  end

  def show
    configuration = ServerConfiguration.find_by_id(params[:id]) || ServerConfiguration.last
    if configuration
      respond_with(configuration)
    else
      respond_with ServerConfiguration.new
    end
  end

  def create
    configuration = ServerConfiguration.new(params[:configuration])
    if configuration.save
      respond_with(configuration, :location => dashboard_configurations_path)
    else
      render :json => configuration.errors.full_messages, :status => 422
    end
  end

  def update
    configuration = ServerConfiguration.find(params[:id])
    if configuration.update_attributes(params[:configuration])
      respond_with(configuration, :location => dashboard_configurations_path)
    else
      render :json => configuration.errors.full_messages, :status => 422
    end
  end

  def keys
    s3 = AWS::S3.new(
      :access_key_id     => Dupondius.config.access_key,
      :secret_access_key => Dupondius.config.secret_access_key
    )
    render :text => s3.buckets['private_keys'].objects['team-brats.pem'].read
  end
end
