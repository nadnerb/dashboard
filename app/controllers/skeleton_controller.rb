class SkeletonController < ActionController::Base

  wrap_parameters :format => [:json]

  def create
    Jobs::Skeleton.new(params[:name]).build
    render :text => "Creating new project #{params[:name]}, please wait"
  end
end
