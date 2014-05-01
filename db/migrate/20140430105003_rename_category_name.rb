class RenameCategoryName < ActiveRecord::Migration
  def change
    rename_column :categories, :man, :name
  end
end
