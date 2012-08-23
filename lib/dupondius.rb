require 'aws-sdk'
require 'dupondius/aws/config'
require 'dupondius/aws/stacks'
#require 'sprintly_current_backlog'

module Dupondius

  class Version

    def self.refspec
      @_refspec ||= `git rev-parse HEAD 2>/dev/null`.strip
    end

    def self.version
      if @_version
        @_version
      else
        versions ||= `git log --decorate --format=format:%d --tags 2>/dev/null | head -n 1`
        @_version = versions[1..-2].split(', ').select { |it| !! (/^v\d+\.\d+\.\d+$/ =~ it) }.first
      end
    end

    def self.build_date
      @_build_date ||= `git log -n 1 #{refspec} --format=%ad 2>/dev/null`.strip
    end

  end

end
