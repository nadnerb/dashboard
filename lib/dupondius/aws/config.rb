
module Dupondius; module Aws; module Config

  class InvalidCredentials < ::StandardError; end

  def self.hosted_zone= zone
    @hosted_zone = zone
  end

  def self.hosted_zone
    @hosted_zone ||= 'dupondi.us'
  end

  def self.aws_credential_file= file
    @aws_credential_file = file
  end

  def self.access_key= key
    @access_key = key
  end

  def self.access_key
    @access_key ||= self.read_file(@aws_credential_file).split("\n")[0].split("=")[1]
  end

  def self.secret_access_key
    @secret_access_key ||= self.read_file(@aws_credential_file).split("\n")[1].split("=")[1]
  end

  def self.secret_access_key= key
    @secret_access_key = key
  end

  private
  def self.read_file(file)
    IO.read(file).strip
  rescue => e
    raise Dupondius::Aws::Config::InvalidCredentials.new "Error: AWS Credentials not provided in the environment. Please set ENV var for AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY or AWS_CREDENTIAL_FILE"
  end

end; end; end
