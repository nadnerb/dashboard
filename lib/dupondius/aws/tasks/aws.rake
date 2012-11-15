require 'dupondius'
require 'aws-sdk'
require 'aws/s3'

begin
  require 'dotenv/tasks'
rescue LoadError
end


namespace :dupondius do

  namespace :aws do

    task :environment => :dotenv do
      Dupondius.configure do |config|
        config.cloudformation_bucket = 'dupondius_cf_templates'
        config.config_bucket = 'dupondius_config'
        config.access_key = ENV['AWS_ACCESS_KEY_ID']
        config.secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
        config.aws_region = ENV['AWS_REGION']
      end
    end

    desc 'Creates a new stack'
    task :create_stack, [:stack_name] => :environment do |t, args|
      template_params = Dupondius::Aws::CloudFormation::Stack.template_params(args.stack_name)
      specified_params = ENV.to_hash.select { |k,v| template_params.include? k}.inject({}){|memo,(k,v)| memo[k.to_sym] = v; memo}
      if template_params.size != specified_params.size
        raise "Unable to find required params in ENV. #{template_params}"
      end
      result = Dupondius::Aws::CloudFormation::Stack.create(args.stack_name,
                                                       ENV['EnvironmentName'],
                                                       ENV['ProjectName'],
                                                       specified_params)
    end

    desc 'Upload assets to s3'
    task :upload_assets => :environment do
      s3 = AWS::S3.new(
        :access_key_id     => Dupondius.config.access_key,
        :secret_access_key => Dupondius.config.secret_access_key
      )
      bucket = s3.buckets[Dupondius.config.config_bucket]

      Dir[File.join(File.dirname(__FILE__), '..', 'config', '*')].each do |filename|
        puts "Uploading asset: #{File.basename(filename)}"
        obj = bucket.objects[File.basename(filename)]
        obj.write(File.open(filename).read)
        obj.acl= :public_read
      end
    end

    desc 'Upload cloudformation templates to s3'
    task :upload_templates => :environment do
      s3 = AWS::S3.new(
        :access_key_id     => Dupondius.config.access_key,
        :secret_access_key => Dupondius.config.secret_access_key
      )
      template_bucket = s3.buckets[Dupondius.config.cloudformation_bucket]

      Dir[File.join(File.dirname(__FILE__), '..', 'templates', '*')].each do |template|
        puts "Uploading template: #{File.basename(template)}"
        obj = template_bucket.objects[File.basename(template)]
        obj.write(File.open(template).read)
        obj.acl= :public_read
      end
    end
  end
end

