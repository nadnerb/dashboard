class StatusController < ActionController::Base
  def index
    hash = {
        :version => Dupondius::Version.version,
        :git_commit => Dupondius::Version.refspec,
        :build_date => Dupondius::Version.build_date
    }
    render :json => hash
  end

  def heart_beat
    render :text => 'OK'
  end
end
