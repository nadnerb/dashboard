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
      @_version ||= `git describe 2>/dev/null`.strip
    end

    def self.build_date
      @_build_date ||= `git show #{refspec} --pretty=tformat:'%cd' 2>/dev/null`.strip
    end

  end

end
