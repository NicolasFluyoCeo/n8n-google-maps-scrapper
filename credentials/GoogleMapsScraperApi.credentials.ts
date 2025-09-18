import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class GoogleMapsScraperApi implements ICredentialType {
  name = 'googleMapsScraperApi';
  displayName = 'Google Maps Scraper API';
  documentationUrl = 'https://github.com/your-username/n8n-nodes-google-maps-scraper';
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'http://localhost:8080',
      placeholder: 'http://localhost:8080',
      description: 'Base URL of the Google Maps Scraper API',
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/v1/jobs',
      method: 'GET',
    },
  };
}
