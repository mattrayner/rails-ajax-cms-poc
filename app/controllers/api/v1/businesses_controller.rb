class API::V1::BusinessesController < ApplicationController
  before_filter :intercept_html_requests
  layout false
  respond_to :json
  before_action :set_business, only: [:show, :edit, :update, :destroy]

  # GET /businesses
  # GET /businesses.json
  def index
    @businesses = Business.all

    g_hash = Array.new

    @businesses.each do |bus|
      tasks = bus.tasks
      t_ids = Array.new

      tasks.each do |task|
        t_ids << task.id
      end

      hash = {id: bus.id, name: bus.name, tasks: t_ids}

      g_hash << hash
    end

    render json: g_hash
  end

  # GET /businesses/1
  # GET /businesses/1.json
  def show
    tasks = @business.tasks
    t_ids = Array.new

    tasks.each do |task|
      taskarray = Array.new

      taskarray << task.id
      taskarray << task.title

      t_ids << taskarray
    end

    hash = {id: @business.id, name: @business.name, tasks: t_ids}

    render json: hash
  end

  # POST /businesses
  # POST /businesses.json
  def create
    @business = Business.new(business_params)

    tasks = params['tasks']

    tasks.each do |id|
      t = Task.find(id)

      if !t.nil?
        @business.tasks << t
      end
    end

    if @business.save
      render json: @business, status: :created
    else
      render json: @business.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /businesses/1
  # PATCH/PUT /businesses/1.json
  def update
    if @business.update(category_params)
      head :no_content
    else
      render json: @business.errors, status: :unprocessable_entity
    end
  end

  # DELETE /businesses/1
  # DELETE /businesses/1.json
  def destroy
    @business.destroy
    
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_business
      @business = Business.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def business_params
      params.require(:business).permit(:name, :tasks)
    end
end
