source = ARGV[0]
force = ARGV[1] == '--force' or ARGV[1] == '-f'

lines = File.open(source).readlines
output = []

matching = false

lines.each do |line|
  if !matching
    if line =~ /^    /
      matching = true
      output << "{% highlight javascript %}\n"
      output << line.gsub(/^    /, '')
    else
      output << line
    end
  else
    if !(line =~ /^    /) and line.strip != ''
      matching = false
      if output.last.strip == ''
        output.pop
      end
      output << "{% endhighlight %}\n"
      output << "\n"
    end
    output << line.gsub(/^    /, '')
  end
end

if force
  File.open(source, 'w+') do |f|
    f.write output.join('')
  end
else
  puts output.join('')
end

