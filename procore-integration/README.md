
## Instructions for localhost
Setup and test the Procore integration locally using your development environment.

### 1. Enable Integration via Localhost UI

- Launch your local UI and go to Control Panel.
- Navigate to the Integration **Procore** section.
- Connect to Procore 
- Enable Projects or Employee integration
- Click **Reset Connection** to refresh MongoDB with the latest access token.

---

### 2. Configure Environment Variables

Update the `.env` file located in the `procore-integration` directory:

```bash
# Set the domain to localhost
SITE_DOMAIN=localhost:3101

# MongoDB connection string
KPA_INTEGRATIONS_DB="mongodb://localhost:27017/anchorock-integrations"
```

### 3. Set the KPA token
- Open your MongoDB instance.
- Locate the procoreconfigs collection.
- Find the document for the correct kpa_site (e.g., acme).
- Copy the kpa_token value.
- Paste it into the kpaToken field in:

``procore-integration/event-execution.json``

### 4. Update API Base URL
In the file ``base-integration/src/api/kpa-project-api.ts``, modify the axios instance configuration:
Change this:
```bash
this.apiInstance = axios.create({ baseURL: `https://api.${process.env.SITE_DOMAIN}/v1` })
```

To this:
```bash
this.apiInstance = axios.create({ baseURL: `http://${process.env.SITE_DOMAIN}/v1` })
```

### 5. Run the build and test
Run build to get latest changes in dist folder from the anchorock-kpa level
`` npm run build ``

Change directory to procore-integration and run test
`` npm test``

