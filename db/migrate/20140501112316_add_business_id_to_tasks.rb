class AddBusinessIdToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :business_id, :integer
  end
end
