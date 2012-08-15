class SkeletonController < ActionController::Base
  wrap_parameters :format => [:json]

  def create
    Skeleton.new(params[:name]).build
    render :text => "Created new project #{params[:name]}"
  end
end
