Dashboard::Application.routes.draw do

  devise_for :users, :controllers => { :omniauth_callbacks => "authentication" }

  devise_scope :user do
    delete "/users/sign_out" => "devise/sessions#destroy"
    get 'sign_in', :to => 'authentication#sign_in_redirect', :as => :new_user_session
    get 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end

  match '/dashboard' => 'dashboard#index'

  namespace :dashboard do
    # this needs some spring cleaning
    resource :stories, :only => [:create, :show]
    resources :performance #, :controller => 'performance'
    resource :configurations, :only => [:create, :show]
    resources :configurations, :only => [:update] do
      get :export, :on => :collection
    end
    #TODO: potential duplication with aws/instances controller
    resources :instances, :only => [:index]
  end

  namespace :aws do
    resources :templates, :only => [:index, :show], :constraints => { :id => /[^\/]+(?=\.json\z)|[^\/]+/ }
    resources :stacks, :constraints => { :id => /[^\/]+(?=\.json\z)|[^\/]+/ } do
      get :available, :on => :collection
      get :template, :on => :member
    end

    resources :instances, :constraints => { :id => /i-\S[^\.\/]+/ },
        :only => [:index, :show, :update] do
      get :cost, :on => :collection
    end
  end
  match '/status' => 'status#index'
  match '/status/heart_beat' => 'status#heart_beat'

  match '/launchpad' => 'launchpad#index'
  resources :projects, :only => [:new, :show, :create]

  get "home/index"

  if Rails.configuration.launchpad_enabled
    root :to => 'under_construction#show'
  else
    root :to => 'dashboard#index'
  end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
