require 'rubygems'
require 'rest_client'

module Sprintly
	class Products
		def initialize
			url = 'https://sprint.ly/api/products.json'
			options = { :user => 'azzamallow@gmail.com', :password => 'pf5yZsjgmnTmbY4VN8KdNTW8pG6jRc77' }
			@resource = RestClient::Resource.new(url, options)
		end

		def get
			JSON.parse(@resource.get)
		end	
	end
end