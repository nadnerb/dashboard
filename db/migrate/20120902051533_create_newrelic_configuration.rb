class CreateNewrelicConfiguration < ActiveRecord::Migration
  def change
    create_table :newrelic_configurations do |t|
      t.string :token
      t.timestamps
    end
  end
end
