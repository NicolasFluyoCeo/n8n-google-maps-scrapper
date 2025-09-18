# n8n-nodes-googlemaps-scraper

This is an n8n community node that integrates with the Google Maps Scraper API. It allows you to create, manage, and download results from Google Maps scraping jobs directly within your n8n workflows.

## Features

- **Create Scraping Jobs**: Create new Google Maps scraping tasks with customizable parameters
- **Job Management**: Get, list, and delete scraping jobs
- **Results Download**: Download job results as CSV files
- **Configurable Base URL**: Use your own API endpoint (not limited to localhost)

## Installation

To install this community node in your n8n instance:

1. Go to **Settings > Community Nodes**
2. Click **Install a community node**
3. Enter `n8n-nodes-googlemaps-scraper`
4. Click **Install**

Alternatively, you can install it via npm:

```bash
npm install n8n-nodes-googlemaps-scraper
```

## Configuration

### Credentials

Before using this node, you need to configure your Google Maps Scraper API credentials:

1. In n8n, go to **Credentials** and create a new credential
2. Select **Google Maps Scraper API**
3. Enter your **Base URL** (e.g., `https://your-api-domain.com` or `http://localhost:8080`)
4. Test the connection and save

### Node Operations

The Google Maps Scraper node supports the following operations:

#### Create Job
Creates a new scraping job with the following parameters:
- **Job Name**: A descriptive name for your scraping job
- **Keywords**: Search terms to scrape (e.g., "coffee shop", "restaurant")
- **Language**: Language code for the search (e.g., "en", "es", "fr")

**Additional Options:**
- **Zoom Level**: Map zoom level (1-20)
- **Coordinates**: Latitude and longitude for search center
- **Fast Mode**: Enable faster scraping
- **Radius**: Search radius in kilometers
- **Depth**: Search depth level
- **Include Email**: Whether to scrape email addresses
- **Max Time**: Maximum time for the scraping job (seconds)
- **Proxies**: Proxy servers to use for scraping

#### Get Job
Retrieves information about a specific job by ID.

#### Get All Jobs
Retrieves a list of all jobs.

#### Delete Job
Deletes a specific job by ID.

#### Download Results
Downloads job results as a CSV file.

## Usage Examples

### Basic Scraping Workflow

1. **Create a Job**: Use the "Create" operation to start a new scraping job
2. **Monitor Progress**: Use "Get Job" to check the status
3. **Download Results**: Once complete, use "Download Results" to get the CSV data

### Example Job Creation

```javascript
{
  "name": "Coffee Shops in New York",
  "keywords": ["coffee shop", "cafe"],
  "lang": "en",
  "zoom": 15,
  "lat": "40.7128",
  "lon": "-74.0060",
  "radius": 5,
  "max_time": 3600
}
```

## API Compatibility

This node is designed to work with the Google Maps Scraper API specification. The API should provide the following endpoints:

- `POST /api/v1/jobs` - Create a new job
- `GET /api/v1/jobs` - Get all jobs
- `GET /api/v1/jobs/{id}` - Get a specific job
- `DELETE /api/v1/jobs/{id}` - Delete a job
- `GET /api/v1/jobs/{id}/download` - Download job results

## Error Handling

The node includes comprehensive error handling:
- API connection errors
- Invalid job IDs
- Server errors
- Malformed requests

Enable "Continue on Fail" in the node settings to handle errors gracefully in your workflow.

## Development

To set up the development environment:

```bash
git clone <repository-url>
cd n8n-nodes-googlemaps-scraper
npm install
npm run build
```

### Scripts

- `npm run build` - Build the node
- `npm run dev` - Build in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

MIT

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/your-username/n8n-nodes-googlemaps-scraper).