require "google/cloud/run/v2"

BON_VOYAGE_JSON_BUIOLDER_RUN_JOB = ENV['BON_VOYAGE_JSON_BUIOLDER_RUN_JOB']

def run_job
  client = Google::Cloud::Run::V2::Jobs::Client.new
  request = Google::Cloud::Run::V2::RunJobRequest.new(
    name: BON_VOYAGE_JSON_BUIOLDER_RUN_JOB
  )

  client.run_job(request)

  puts "Run job: #{BON_VOYAGE_JSON_BUIOLDER_RUN_JOB}"
end
