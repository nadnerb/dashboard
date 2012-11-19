class AddDeployKeyToProject < ActiveRecord::Migration
  def change
    add_column :projects, :github_deploy_key, :text
  end
end
