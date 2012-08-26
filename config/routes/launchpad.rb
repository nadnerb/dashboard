Dashboard::Application.routes.draw do

  if Rails.configuration.launchpad_enabled
    resources :projects, :only => [:new, :create, :show]
    match 'launchpad' => 'projects#new'

    resource :skeleton, :only => :create, :controller => 'skeleton'
    resource :source, :only => :new do
      get 'callback'
    end
  end
end

