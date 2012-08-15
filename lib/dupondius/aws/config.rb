
module Dupondius; module Aws; module Config

  class InvalidCredentials < ::StandardError; end

  def self.aws_credential_file= file
    @aws_credential_file = file
  end

  def self.access_key
    @access_key ||= self.read_file(@aws_credential_file).split("\n")[0].split("=")[1]
  end

  def self.secret_access_key
    @secret_access_key ||= self.read_file(@aws_credential_file).split("\n")[1].split("=")[1]
  end

  private
  def self.read_file(file)
    IO.read(file).strip
  rescue => e
    raise Dupondius::Aws::Config::InvalidCredentials.new "error reading file #{file}"
  end

end; end; end
