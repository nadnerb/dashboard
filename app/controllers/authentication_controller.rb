class AuthenticationController < Devise::OmniauthCallbacksController
  skip_before_filter :verify_authenticity_token, :only => [:google_apps]

  def google_apps
    @user = User.find_for_googleapps_oauth(request.env["omniauth.auth"], current_user)

    if @user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
      sign_in_and_redirect @user, :event => :authentication
    else
      session["devise.google_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def sign_in_redirect
    redirect_to user_omniauth_authorize_path(:google_apps)
  end
end
