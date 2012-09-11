require 'yajl'
require "base64"
require 'openssl'
require 'digest/sha2'
require 'httparty'
require 'ap'

class Jobs::LaunchCi

  attr_reader :project, :params

  MAGIC = "::::MAGIC::::"
  SECRET = '7b314451c3b147f401f2330d21d848a81573c5b376317ced06d1c63d4fb65778'
  PKEY = 'https://s3.amazonaws.com/private_keys/team-brats.pem'

  def initialize(project, params)
    @project = project
    @params = params
  end

  def run
    user = Source::Commands.new(@project.token).user['login']
    tech_stack = tech_stack(params[:project][:tech_stack]).to_s
    options = {
        KeyName: 'team-brats',
        InstanceType: 'm1.small',
        ProjectGithubUser: user.to_s,
        ProjectType: tech_stack,
        AccessKey: string_value(params[:project][:aws][:accessKey], Dupondius.config.access_key),
        SecretAccessKey: encrypt(string_value(params[:project][:aws][:secretAccessKey], Dupondius.config.secret_access_key)),
        PrivateKey: encrypt(string_value(params[:project][:aws][:privateKey], PKEY))
    }
    ap options
    Dupondius::Aws::CloudFormation::ContinuousIntegration.create(@project.name, tech_stack, options)
  end

  def tech_stack(tech)
    case tech
      when 'Ruby on Rails' then 'rails'
      when 'Java' then 'java'
      when 'Grails' then 'grails'
      else
        'rails'
    end
  end

  def encrypt(data)
    blocks = (data + MAGIC).scan(/.{1,16}/)
    encrypted_data = []
    sha256 = Digest::SHA2.new(256)
    aes = OpenSSL::Cipher.new("AES-128-CBC")
    key = sha256.digest(SECRET)
    blocks.each do |block|
      aes.reset
      aes.encrypt
      aes.key = key
      encrypted_data << aes.update(block)
      encrypted_data << aes.final if block.length < 16
    end
    result = Base64.encode64(encrypted_data.join).gsub(/\n/, '').gsub(/\\/, '\\').gsub(/\//, '\/')
    Rails.logger.info "ENCRYPT: #{data} --> #{result}"
    result
  end

  def string_value(value, default)
    if value.nil? || value.empty?
      if default =~ /^https:\/\//
        HTTParty.get(default).body
      else
        default
      end
    else
      value
    end
  end

  def default_pkey

  end

  handle_asynchronously :run
end
