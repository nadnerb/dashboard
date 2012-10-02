class AddNewRelicKey < ActiveRecord::Migration
  def change
    add_column :server_configurations, :newrelic_key, :string
  end
end
