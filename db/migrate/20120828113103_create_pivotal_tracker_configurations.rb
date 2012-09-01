class CreatePivotalTrackerConfigurations < ActiveRecord::Migration
  def change
    create_table :pivotal_tracker_configurations do |t|
      t.string :token
      t.integer :project_id
      t.timestamps
    end
  end
end
