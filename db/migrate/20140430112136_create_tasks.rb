class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.integer :duration
      t.integer :priority

      t.integer :category_id 

      t.timestamps
    end

    add_index :tasks, :category_id
  end
end
