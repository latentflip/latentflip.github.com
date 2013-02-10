require 'listen'

desc "Reload"
task :reload do
  Listen.to("./", :ignore => %r{^_site/}) do |modified, added, removed|
    if modified.grep(/\.scss$/).any?
      puts "Sassy"
      `sass assets/stylesheets/app.scss assets/stylesheets/app.css`
    else
      puts "Jekylling"
      `jekyll`
    end
  end
end

desc "Deploy"
task :deploy do
  `cd _deploy && ls -l | grep -v '.git' | xargs rm -rf`
  `cp -r _site/* _deploy/`
  puts "Cleaned and copied from _site to _deploy"
end
