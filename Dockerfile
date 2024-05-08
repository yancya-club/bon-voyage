FROM ruby
WORKDIR /my/path
COPY . .
RUN gem install bundler && bundle install
CMD ["ruby", "main.rb"]
