class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :man
      t.text :description
      t.datetime :date_created

      t.timestamps
    end
  end
end
