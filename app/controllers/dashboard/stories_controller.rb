require 'pivotal_tracker'

class Dashboard::StoriesController < ActionController::Base

	def show
		# this is azzamallows account, with an example project. there is not enough data in there to show it off
		PivotalTracker::Client.token = 'da4f9bf2587bd8b68bef789846b35b3d' 
		# project = PivotalTracker::Project.find(621317)

		# Public project with lots of data
		project = PivotalTracker::Project.find(627145)

		render :json => PivotalTracker::Iteration.current(project)
	end

	# we can do more things, might use this later
	# def all_stories_for_current_release
	# 	project = PivotalTracker::Project.find(102714)
	# 	iterations = PivotalTracker::Iteration.current_backlog(project)

	# 	stories = []
	# 	iterations.each do | iteration |
	# 		stories.concat iteration.stories
	# 	end

	# 	return stories
	# end
end
