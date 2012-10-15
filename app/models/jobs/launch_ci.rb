require 'yajl'
require "base64"
require 'openssl'
require 'digest/sha2'
require 'httparty'

class Jobs::LaunchCi

  attr_reader :project, :params

  MAGIC = "::::MAGIC::::"
  SECRET = '7b314451c3b147f401f2330d21d848a81573c5b376317ced06d1c63d4fb65778'
  TEAM_BRATS_KEY = %q{-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAnjypkDcDLZPtL0peKhp5h0HwxBeGlRAxw18N2IH5JFW45t80GQYYUfm7kZYb
NOHubCvmUB0iwk03M047HX6hRRSIPpZ/rlSek//Ldvysng9QEFbCe3qxSyIqO/11iV/5VKMklOie
5DS8oz6YYc1Mv+cFinwbCO4fDWVWyGzdE9zfFQXXgDEGVmVyTehwrJ2x7ss2YTM2TWbWq80xufLD
nlkhPyGPgcdAVbsbqoUZZF1axZ9++ZVlmW7sO8rpaN1umdtAkIMqCAya4Su52EUjoHGStaNkJ0EZ
2M9LJkP4pyNLXtLbfWmXUrSdcBSXZlfdNWN/arZhkl4CH4O5P6B9GQIDAQABAoIBAQCDtPBZ9kAx
7p+MLjVEjDa9Szhwrzg42HrjKDopDL3n7WXy3LPLZFRX3yqtWiiZErjV1pBj/GxTF9wrWyE/QohP
LHDez3vFCe/YNiAPkO7IvOwiPWSxTIVHiU9oEWaEiprIROaM/zZJsk+U/OPu++e3Dz6Abx49h53X
E5NxTZOSFIBQEznGy9fjMmhC6qoGIDLrLnwZnpgzoZx0TSJXkvUwu6SgbHjriZGh/kL9Ocq3mfCt
bKYopuhV0TgXiNLgOAe0u7ojd/9oMY0ovfvpovfYslzSc4GW7UQawHS9Si4Cfm+y2qYXWlCRzpLG
h1uS/NQNfzu55FA3MBI7p/8EurtFAoGBAPBVu2OIX37xlpeTxuJQY5e9S2PLpDXcyqGUjTAJH7Jz
JlCExeEMN3T+IKvOXPbH4aviIXvG7jGjgmj2GaR9XNZsbdOZMiQU856PKr9NLRkdOO84jpGPZ7Mj
kjK0fd0ay2LhyT1WpIWi8l1xmfz/BExCv7FEdQgXGzw4K/tGt7BfAoGBAKiNB9mpQkthD8VafzSs
O4/Hs9WH7A5Q7Hn+iKWfz5OZTWseb74YqmTCZMR/GFWDwwoSjWmKwUqkscB2Clmw6j1Tg5dneq8P
3bYFpvtrA09H9h4Bc4vo0GPz/IuWzV76q3FyyoLJUMy3nT9WKHvqhKVMyXJu2MsFsvoI/Z0u82WH
AoGAST2XManpkEIHZoH+ZhGhiCiDxRHWJSP4DG286Rqesj8tOfR8aSzT6a9YPYNSCVK4jy0GjzX8
eNwfbeUxw1MA68d3YLia8yv/Yh63JD1ctP6WzzApImrVa143u4QNp0f3G1c7gJna4W7a9WcdSmBc
6vCcgmUeVSzVe/CSVq0iZXkCgYA0ML8+iaeKebqNbJE4+R/UTI0F0HmqkSo4ODWNu2dmF7EeOyV0
omSYoIzdP1GEoTESfF4nURy7BTY5FxPrY9mUNbjod9VIQcxwIV3sOd2jfe/aqK5joypr2M/ZVU+w
WkQd8+J7DuUjDrP1ObN9c0exe45hDau5acFapNALDM+3HwKBgBulHCUX5KmoVnYqBt2DrLi3nIir
IvgFTXLL+TfupY32UylqBSRnJog6ptoUAtcvpBhlCkEDJk5BJhXoYQq6OQ8q2kiOjpA9qBN9ELPe
Lmr4SHW+drjBjgk2XOf3oCTcj1EkAD2ZsU0Inxqh+u7EmLGeoD9zZSFJUU+KAAShVv4i
-----END RSA PRIVATE KEY-----}

  def initialize(project, params)
    @project = project
    @params = params
  end

  def run
    user = Source::Commands.new(@project.token).user['login']
    tech_stack = tech_stack(params[:project][:tech_stack]).to_s
    options = {
        AwsAccessKey: @project.aws_access_key,
        AwsSecretAccessKey: @project.aws_secret_access_key,
        KeyName: @project.aws_key_name,
        InstanceType: 'm1.small',
        ProjectGithubUser: user.to_s,
        ProjectType: tech_stack,
        SecretAccessKeyEnc: encrypt(@project.aws_secret_access_key),
        PrivateKeyEnc: encrypt(TEAM_BRATS_KEY)
    }
    Dupondius::Aws::CloudFormation::ContinuousIntegration.create(@project.name, tech_stack, @project.region, options)
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
    end
    encrypted_data << aes.final
    result = Base64.encode64(encrypted_data.join).gsub(/\n/, '').gsub(/\\/, '\\').gsub(/\//, '\/')
    Rails.logger.info "ENCRYPT: #{data} --> #{result}"
    result
  end

  handle_asynchronously :run
end
