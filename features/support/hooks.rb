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

Around('@canary') do |scenario, block|
  if !cucumber_config.options[:tag_expressions].select { |tag| tag == '@canary' }.empty?
    old_host = Capybara.app_host
    Capybara.app_host = 'http://canary.dupondi.us'
    begin
      block.call
    ensure
      Capybara.app_host = old_host
    end
  else
    block.call
  end
end