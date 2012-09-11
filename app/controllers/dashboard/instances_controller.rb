class Dashboard::InstancesController < ApplicationController

  respond_to :json

  def index
    r53 = Dupondius::Aws::Route53.access
    result = []
    r53.client.list_hosted_zones[:hosted_zones].each do |hosted_zone|
      r53.client.list_resource_record_sets(:hosted_zone_id => hosted_zone[:id])[:resource_record_sets].each do |rrs|
        rrs[:resource_records].each do |rs|
          result << {name: rrs[:name], instance_name: rs[:value], id: rrs[:name].gsub(/\./, '-')}
        end if rrs[:type] == 'CNAME' && rrs[:name].end_with?("#{Dupondius.config.project_name}.#{Dupondius.config.hosted_zone}.")
      end
    end
    render :json => result
  end

end
