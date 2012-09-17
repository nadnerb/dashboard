class Aws::InstancesController < ApplicationController

  respond_to :json

  def index
    respond_with(Dupondius::Aws::Ec2::Instance.all)
  end

  def show
    respond_with(Dupondius::Aws::Ec2::Instance.find(params[:id]))
  end

  def update
    instance = Dupondius::Aws::Ec2::Instance.find(params[:id])
    instance.send(JSON.parse(request.body.read)['status'])
    respond_with(instance)
  end

  def cost
    per_day = Dupondius::Aws::Ec2::Instance.all.inject(0.0) {|sum, i| sum + i.cost }
    respond_with(:cost_per_day => "%.2f" % per_day, :estimated_monthly_cost => "%.2f" % (per_day * 28.0))
  end
end

