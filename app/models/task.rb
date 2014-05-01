class Task < ActiveRecord::Base
  belongs_to :category
  has_and_belongs_to_many :dependencies, :foreign_key => 'id', :class_name => "Task"
  has_and_belongs_to_many :businesses
end
