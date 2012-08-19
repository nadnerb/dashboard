require 'fileutils'

After do |scenario|
    screencap_dir = "reports/images/#{scenario.name.gsub(/\s+/, '_').to_s[0..50]}"
    if not File.directory? screencap_dir
      FileUtils.mkdir_p screencap_dir
    end
    page.driver.browser.save_screenshot("#{screencap_dir}/#{Time.now.to_i}.png")
end