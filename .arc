@app
begin-app

@static
prune true

@events
upload
  src jobs/upload

@plugins
enhance/arc-plugin-enhance
enhance/styles-cribsheet
s3
  src plugins/s3
