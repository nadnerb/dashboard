Dir[File.join(File.dirname(__FILE__), '..', 'dupondius', 'aws', 'tasks', '**/*.rake')].sort.each { |ext| load ext }

