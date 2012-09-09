class AddTechStackToProject < ActiveRecord::Migration
  def change
    add_column :projects, :tech_stack, :string
  end
end
