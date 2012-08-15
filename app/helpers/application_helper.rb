require 'yaml'

module ApplicationHelper

  def application_version
    version ||= YAML::load_file File.join(File.dirname(__FILE__), '..', '..', 'config', 'version.yaml')
  end

  def application_version_html
    version = application_version[:version].to_s
    attrs = []
    attrs << application_version[:build_date] unless application_version[:build_date].blank?
    attrs << application_version[:git_commit] unless application_version[:git_commit].blank?
    version += " (#{attrs.join(', ')})" if attrs
    version
  end

end
