class ChangeNewRelicConfigToUseIframes < ActiveRecord::Migration
  def up
    remove_column :newrelic_configurations, :token
    add_column :newrelic_configurations, :iframe, :string
  end

  def down
    add_column :newrelic_configurations, :token, :string
    remove_column :newrelic_configurations, :iframe
  end
end
