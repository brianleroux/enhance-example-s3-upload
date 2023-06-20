## setup

this example relies on three environment variables:

- OWNER_REDIRECT
- OWNER_KEY
- OWNER_SECRET

add env vars to deployed infra with:

```bash
arc env --add --env staging OWNER_REDIRECT https://94pk9h7m2j.execute-api.us-west-2.amazonaws.com/success
```

## todo

- auto expire uploads
- auto expire parsed files
