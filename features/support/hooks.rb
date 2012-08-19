require 'fileutils'

After do |scenario|
    screencap_dir = "reports/images/#{scenario.name.gsub(/\s+/, '_').to_s[0..50]}"
    if not File.directory? screencap_dir
      FileUtils.mkdir_p screencap_dir
    end
    page.driver.browser.save_screenshot("#{screencap_dir}/#{Time.now.to_i}.png")
end

cucumber_config = nil
AfterConfiguration do |config|
  cucumber_config = config
end

Around('@deploy_test') do |scenario, block|
  running_as = running_as?(cucumber_config, [:canary, :qa, :staging, :production])
  if running_as
    run_against(running_as, block)
  else
    block.call
  end
end

def running_as?(cucumber_config, tags)
  tags_to_check = tags.map { |tag| "@#{tag}" }
  cucumber_config.options[:tag_expressions].select { |tag| tags_to_check.include? tag }.first
end

def run_against(tag, block)
  old_host = Capybara.app_host
  Capybara.app_host = "http://#{tag[1..-1]}.dupondi.us"
  begin
    block.call
  ensure
    Capybara.app_host = old_host
  end
end
