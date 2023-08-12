# anchorock project

We'll need to meet to review this project and decide how much we're missing.

I was told you may have limited experience with NodeJS. So I thought I'd include practical examples of common patterns. I also implemented a basic worker model based on our own worker process.

And, given it seemed like we'd need to upload content to S3 I included an S3 service in the `shared-helpers` folder.

## Features

- NodeJS v18 (LTS)
- Typescript
- ESLint

## Missing from project

- Secrets management
- Database connectors
- CRON service
- Emailer
- Data storage
# install & run

1. Download & Install NodeJS LTS (v18): https://nodejs.org/it/download
2. From project directory:
   - Install depedencies: `npm ci`
   - To run example code: `npm start`

> `aws-sdk`: AWS is promoting a newer v3 version that deviates from the current v2. I would prefer using the latest, but I didn't have time to learn the differences. Our other production products are currently using v2.

# folder structure

## shared-helpers
> Intended to hold common functionality and services used throughout the project.

- `api`: generalized APIs to third party services.
- `global-register`: Application-wide settings that need to be defined first. Or that are important enough to add to the global namespace. ex: `global.log
- `s3`: basic S3 implementation. Includes examples for streaming content to S3 from a URL or local file. Requires AWS Key + Secret to work.

## worker

### shared
> Services and types shared among the `worker` folder.

### workers
> Intended to hold a list of workers defined per file or sub-folder. It will automtically import any file in that folder following the convention of "-worker.ts". ex: "paylocity-worker.ts"

### queue
> Our current process runs on a CRON timer. This just iterates through the list of workers and starts them.
