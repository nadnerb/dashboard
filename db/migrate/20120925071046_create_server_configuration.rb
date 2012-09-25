class CreateServerConfiguration < ActiveRecord::Migration
  def change
    create_table :server_configurations do |t|
      t.string :new_relic_token
      t.timestamps
    end
  end
end
