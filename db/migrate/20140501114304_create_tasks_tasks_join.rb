
class CreateTasksTasksJoin < ActiveRecord::Migration
  def change
    create_table :tasks_tasks do |t|
      t.integer "task_id"
      t.integer "task_id"
    end
  end
end
