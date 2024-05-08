require "json"
require "google/cloud/storage"

PROJECT_ID = "yancya-club"
BUCKET_NAME = "yancya-club-bon-voyage"
PREFIX = "positions/"
JSON_FILE_NAME = "positions.json"

puts "Start!"

storage = Google::Cloud::Storage.new(project_id: PROJECT_ID)
bucket = storage.bucket(BUCKET_NAME)
files = bucket.files(prefix: PREFIX)

files.map { |f|
  next if f.name.end_with?("/")
  puts "File: #{f.name} is processing..."
  visited_at = Time.at(f.name.gsub(/\.txt$/, "").to_i / 1_000_000_000).to_s
  latitude, longitude, altitude = f.download.tap(&:rewind).read.split(",").map(&:to_f)
  { visited_at:, latitude:, longitude:, altitude: }
}.compact.to_json.tap do |positions_json|
  puts "Write to GCS..."
  bucket.create_file(StringIO.new(positions_json), JSON_FILE_NAME)
end

puts "Done!"