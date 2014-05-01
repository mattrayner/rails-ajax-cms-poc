class API::V1::TasksController < ApplicationController
  before_filter :intercept_html_requests
  layout false
  respond_to :json
  before_action :set_task, only: [:show, :edit, :update, :destroy]

  # GET /categories
  # GET /categories.json
  def index
    @tasks = Task.all

    render json: @tasks
  end

  # GET /categories/1
  # GET /categories/1.json
  def show
    render json: @task
  end

  # POST /categories
  # POST /categories.json
  def create
    @task = Task.new(task_params)

    if @task.save
      render json: @task, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /categories/1
  # PATCH/PUT /categories/1.json
  def update
    if @task.update(category_params)
      head :no_content
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  # DELETE /categories/1
  # DELETE /categories/1.json
  def destroy
    @task.destroy
    
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_task
      @task = Task.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def task_params
      params.require(:task).permit(:title, :description, :duration, :priority, :category_id)
    end
end
