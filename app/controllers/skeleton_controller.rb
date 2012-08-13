class SkeletonController < ActionController::Base
  wrap_parameters :format => [:json]

  def create
    Skeleton.new.build(params[:name])
    render :text => "Created new project #{params[:name]}"
  end
end
