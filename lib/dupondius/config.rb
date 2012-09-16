
module Dupondius
  class InvalidCredentials < ::StandardError; end

  module Config
    extend self

    def key_name= name
      @key_name = name
    end

    def key_name
      @key_name
    end

    def aws_region= region
      @aws_region = region
    end

    def aws_region
      @aws_region
    end

    def project_name= name
      @project_name = name
    end

    def project_name
      @project_name
    end

    def hosted_zone= zone
      @hosted_zone = zone
    end

    def hosted_zone
      @hosted_zone ||= 'dupondi.us'
    end

    def access_key= key
      @access_key = key
    end

    def access_key
      @access_key
    end

    def secret_access_key
      @secret_access_key
    end

    def secret_access_key= key
      @secret_access_key = key
    end

    def github_client_id= id
      @github_client_id = id
    end

    def github_client_id
      @github_client_id
    end

    def github_secret= secret
      @github_secret= secret
    end

    def github_secret
      @github_secret
    end

  end
end
