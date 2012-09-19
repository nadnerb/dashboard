class AddGithubToProject < ActiveRecord::Migration
  def change
    add_column :projects, :github_account, :string
    add_column :projects, :github_project, :string
  end
end
