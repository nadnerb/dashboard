class AddAwsDetailsToProject < ActiveRecord::Migration
  def change
    add_column :projects, :aws_access_key, :string
    add_column :projects, :aws_secret_access_key, :string
    add_column :projects, :aws_key_name, :string
  end
end
