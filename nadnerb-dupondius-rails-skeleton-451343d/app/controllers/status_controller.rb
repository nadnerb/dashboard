class StatusController < ApplicationController
  def heart_beat
    render :text => 'OK'
  end

  def version
    render :text => app_version
  end

  private 

  def app_version
    refspec = `git rev-parse HEAD 2>/dev/null`.strip
    versions = `git log --decorate --format=format:%d #{refspec} 2>/dev/null | awk '/v[0-9]+\\.[0-9]+\\.[0-9]+/' | head -n 1`
    version = versions[1..-2].split(', ').collect { |it| it.match(/v\d+\.\d+\.\d+/) }.select { |it| it }.first[0] if versions.size > 1
    version || '0.0.0'
  end
end
