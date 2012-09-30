class ProjectGithubPrivate < ActiveRecord::Migration
  def change
    add_column :projects, :github_private, :boolean
  end
end
