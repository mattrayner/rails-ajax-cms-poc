
class CreateBusinessTasksJoin < ActiveRecord::Migration
  def change
    create_table :businesses_tasks do |t|
      t.integer "business_id"
      t.integer "task_id"
    end
  end
end
