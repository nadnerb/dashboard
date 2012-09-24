class ChangeNewRelicIframeToSource < ActiveRecord::Migration
  def up
    remove_column :newrelic_configurations, :iframe
    add_column :newrelic_configurations, :source, :string
  end

  def down
    add_column :newrelic_configurations, :iframe, :string
    remove_column :newrelic_configurations, :source
  end
end
