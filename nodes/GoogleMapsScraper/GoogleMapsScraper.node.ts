import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class GoogleMapsScraper implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Google Maps Scraper',
    name: 'googleMapsScraper',
    icon: 'file:googlemaps.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Google Maps Scraper API',
    defaults: {
      name: 'Google Maps Scraper',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'googleMapsScraperApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Job',
            value: 'job',
          },
        ],
        default: 'job',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['job'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a new scraping job',
            action: 'Create a job',
          },
          {
            name: 'Delete',
            value: 'delete',
            description: 'Delete a job',
            action: 'Delete a job',
          },
          {
            name: 'Download Results',
            value: 'download',
            description: 'Download job results as CSV',
            action: 'Download job results',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a job',
            action: 'Get a job',
          },
          {
            name: 'Get All',
            value: 'getAll',
            description: 'Get all jobs',
            action: 'Get all jobs',
          },
        ],
        default: 'create',
      },

      // Create Job Fields
      {
        displayName: 'Job Name',
        name: 'jobName',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: '',
        placeholder: 'Coffee shops in Madrid',
        description: 'Name for the scraping job',
      },
      {
        displayName: 'Keywords',
        name: 'keywords',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: {},
        options: [
          {
            name: 'keyword',
            displayName: 'Keyword',
            values: [
              {
                displayName: 'Keyword',
                name: 'value',
                type: 'string',
                default: '',
                placeholder: 'coffee shop',
              },
            ],
          },
        ],
        description: 'Search keywords for scraping',
      },
      {
        displayName: 'Language',
        name: 'lang',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: 'en',
        placeholder: 'en',
        description: 'Language code for search results',
      },
      {
        displayName: 'Zoom Level',
        name: 'zoom',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: 15,
        description: 'Map zoom level (1-20)',
      },
      {
        displayName: 'Latitude',
        name: 'lat',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: '',
        placeholder: '40.4168',
        description: 'Latitude coordinate for search center',
      },
      {
        displayName: 'Longitude',
        name: 'lon',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: '',
        placeholder: '-3.7038',
        description: 'Longitude coordinate for search center',
      },
      {
        displayName: 'Fast Mode',
        name: 'fastMode',
        type: 'boolean',
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: false,
        description: 'Whether to use fast mode for scraping',
      },
      {
        displayName: 'Radius (km)',
        name: 'radius',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: 10,
        description: 'Search radius in kilometers',
      },
      {
        displayName: 'Depth',
        name: 'depth',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: 1,
        description: 'Search depth level',
      },
      {
        displayName: 'Include Email',
        name: 'email',
        type: 'boolean',
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: false,
        description: 'Whether to scrape email addresses',
      },
      {
        displayName: 'Max Time (seconds)',
        name: 'maxTime',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: 3600,
        description: 'Maximum time for job execution in seconds',
      },
      {
        displayName: 'Proxies',
        name: 'proxies',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            operation: ['create'],
            resource: ['job'],
          },
        },
        default: {},
        options: [
          {
            name: 'proxy',
            displayName: 'Proxy',
            values: [
              {
                displayName: 'Proxy URL',
                name: 'value',
                type: 'string',
                default: '',
                placeholder: 'http://proxy.example.com:8080',
              },
            ],
          },
        ],
        description: 'Proxy servers to use for scraping',
      },

      // Job ID field for get, delete, download operations
      {
        displayName: 'Job ID',
        name: 'jobId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['get', 'delete', 'download'],
            resource: ['job'],
          },
        },
        default: '',
        placeholder: '6f0c1af8-3c4e-4742-84bb-590938ae8930',
        description: 'The ID of the job',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);

    const credentials = await this.getCredentials('googleMapsScraperApi');
    const baseUrl = credentials.baseUrl as string;

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'job') {
          if (operation === 'create') {
            // Create Job
            const jobName = this.getNodeParameter('jobName', i) as string;
            const keywordsData = this.getNodeParameter('keywords', i) as any;
            const lang = this.getNodeParameter('lang', i) as string;
            const zoom = this.getNodeParameter('zoom', i) as number;
            const lat = this.getNodeParameter('lat', i) as string;
            const lon = this.getNodeParameter('lon', i) as string;
            const fastMode = this.getNodeParameter('fastMode', i) as boolean;
            const radius = this.getNodeParameter('radius', i) as number;
            const depth = this.getNodeParameter('depth', i) as number;
            const email = this.getNodeParameter('email', i) as boolean;
            const maxTime = this.getNodeParameter('maxTime', i) as number;
            const proxiesData = this.getNodeParameter('proxies', i) as any;

            // Process keywords
            const keywords: string[] = [];
            if (keywordsData.keyword) {
              for (const keyword of keywordsData.keyword) {
                keywords.push(keyword.value);
              }
            }

            // Process proxies
            const proxies: string[] = [];
            if (proxiesData.proxy) {
              for (const proxy of proxiesData.proxy) {
                proxies.push(proxy.value);
              }
            }

            const body: any = {
              name: jobName,
              keywords,
              lang,
              zoom,
              depth,
              email,
              max_time: maxTime,
            };

            // Add optional fields
            if (lat) body.lat = lat;
            if (lon) body.lon = lon;
            if (fastMode !== undefined) body.fast_mode = fastMode;
            if (radius) body.radius = radius;
            if (proxies.length > 0) body.proxies = proxies;

            const options: OptionsWithUri = {
              method: 'POST',
              uri: `${baseUrl}/api/v1/jobs`,
              body,
              json: true,
            };

            const responseData = await this.helpers.request(options);
            returnData.push({ json: responseData });

          } else if (operation === 'getAll') {
            // Get All Jobs
            const options: OptionsWithUri = {
              method: 'GET',
              uri: `${baseUrl}/api/v1/jobs`,
              json: true,
            };

            const responseData = await this.helpers.request(options);
            
            // If response is an array, return each job as separate item
            if (Array.isArray(responseData)) {
              for (const job of responseData) {
                returnData.push({ json: job });
              }
            } else {
              returnData.push({ json: responseData });
            }

          } else if (operation === 'get') {
            // Get Job
            const jobId = this.getNodeParameter('jobId', i) as string;

            const options: OptionsWithUri = {
              method: 'GET',
              uri: `${baseUrl}/api/v1/jobs/${jobId}`,
              json: true,
            };

            const responseData = await this.helpers.request(options);
            returnData.push({ json: responseData });

          } else if (operation === 'delete') {
            // Delete Job
            const jobId = this.getNodeParameter('jobId', i) as string;

            const options: OptionsWithUri = {
              method: 'DELETE',
              uri: `${baseUrl}/api/v1/jobs/${jobId}`,
              json: true,
            };

            await this.helpers.request(options);
            returnData.push({ 
              json: { 
                success: true, 
                message: `Job ${jobId} deleted successfully` 
              } 
            });

          } else if (operation === 'download') {
            // Download Results
            const jobId = this.getNodeParameter('jobId', i) as string;

            const options: OptionsWithUri = {
              method: 'GET',
              uri: `${baseUrl}/api/v1/jobs/${jobId}/download`,
              encoding: null, // Important for binary data
            };

            const responseData = await this.helpers.request(options);
            
            returnData.push({
              json: {},
              binary: {
                data: {
                  data: responseData,
                  mimeType: 'text/csv',
                  fileName: `job_${jobId}_results.csv`,
                },
              },
            });
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
            pairedItem: {
              item: i,
            },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error, {
          itemIndex: i,
        });
      }
    }

    return [returnData];
  }
}
