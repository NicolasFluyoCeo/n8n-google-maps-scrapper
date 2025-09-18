import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
	NodeApiError,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class GoogleMapsScraper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Maps Scraper',
		name: 'googleMapsScraper',
		icon: 'file:googlemaps.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Google Maps Scraper API for scraping Google Maps data',
		defaults: {
			name: 'Google Maps Scraper',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'googleMapsScraperApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
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
						name: 'Get',
						value: 'get',
						description: 'Get a specific job by ID',
						action: 'Get a job',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all jobs',
						action: 'Get all jobs',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a specific job',
						action: 'Delete a job',
					},
					{
						name: 'Download Results',
						value: 'download',
						description: 'Download job results as CSV',
						action: 'Download job results',
					},
				],
				default: 'create',
			},

			// Job ID field (for get, delete, download operations)
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['get', 'delete', 'download'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the job',
			},

			// Create job fields
			{
				displayName: 'Job Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Name for the scraping job',
				placeholder: 'Coffee shops in New York',
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				default: { values: [{ keyword: '' }] },
				required: true,
				typeOptions: {
					multipleValues: true,
				},
				description: 'Keywords to search for',
				options: [
					{
						name: 'values',
						displayName: 'Keyword',
						values: [
							{
								displayName: 'Keyword',
								name: 'keyword',
								type: 'string',
								default: '',
								placeholder: 'coffee shop',
							},
						],
					},
				],
			},
			{
				displayName: 'Language',
				name: 'lang',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				default: 'en',
				description: 'Language code for the search',
				placeholder: 'en, es, fr, de, etc.',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Zoom Level',
						name: 'zoom',
						type: 'number',
						default: 15,
						description: 'Map zoom level (1-20)',
						typeOptions: {
							minValue: 1,
							maxValue: 20,
						},
					},
					{
						displayName: 'Latitude',
						name: 'lat',
						type: 'string',
						default: '',
						description: 'Latitude coordinate for the search center',
						placeholder: '40.7128',
					},
					{
						displayName: 'Longitude',
						name: 'lon',
						type: 'string',
						default: '',
						description: 'Longitude coordinate for the search center',
						placeholder: '-74.0060',
					},
					{
						displayName: 'Fast Mode',
						name: 'fast_mode',
						type: 'boolean',
						default: false,
						description: 'Whether to use fast mode scraping',
					},
					{
						displayName: 'Radius (km)',
						name: 'radius',
						type: 'number',
						default: 10,
						description: 'Search radius in kilometers',
						typeOptions: {
							minValue: 1,
						},
					},
					{
						displayName: 'Depth',
						name: 'depth',
						type: 'number',
						default: 1,
						description: 'Search depth level',
						typeOptions: {
							minValue: 1,
						},
					},
					{
						displayName: 'Include Email',
						name: 'email',
						type: 'boolean',
						default: false,
						description: 'Whether to scrape email addresses',
					},
					{
						displayName: 'Max Time (seconds)',
						name: 'max_time',
						type: 'number',
						default: 3600,
						description: 'Maximum time for the scraping job in seconds',
						typeOptions: {
							minValue: 60,
						},
					},
					{
						displayName: 'Proxies',
						name: 'proxies',
						type: 'fixedCollection',
						default: { values: [] },
						typeOptions: {
							multipleValues: true,
						},
						description: 'Proxy servers to use for scraping',
						options: [
							{
								name: 'values',
								displayName: 'Proxy',
								values: [
									{
										displayName: 'Proxy URL',
										name: 'proxy',
										type: 'string',
										default: '',
										placeholder: 'http://proxy.example.com:8080',
									},
								],
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'job') {
					if (operation === 'create') {
						// Create new job
						const name = this.getNodeParameter('name', i) as string;
						const keywordsCollection = this.getNodeParameter('keywords', i) as {
							values: Array<{ keyword: string }>;
						};
						const keywords = keywordsCollection.values.map((item) => item.keyword).filter(Boolean);
						const lang = this.getNodeParameter('lang', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							keywords,
							lang,
							...additionalFields,
						};

						// Handle proxies if provided
						if (additionalFields.proxies) {
							const proxiesCollection = additionalFields.proxies as {
								values: Array<{ proxy: string }>;
							};
							body.proxies = proxiesCollection.values.map((item) => item.proxy).filter(Boolean);
						}

						const requestOptions: IRequestOptions = {
							method: 'POST',
							url: '/api/v1/jobs',
							body,
							json: true,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'googleMapsScraperApi',
							requestOptions,
						);

						returnData.push({
							json: responseData as IDataObject,
							pairedItem: { item: i },
						});

					} else if (operation === 'get') {
						// Get specific job
						const jobId = this.getNodeParameter('jobId', i) as string;

						const requestOptions: IRequestOptions = {
							method: 'GET',
							url: `/api/v1/jobs/${jobId}`,
							json: true,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'googleMapsScraperApi',
							requestOptions,
						);

						returnData.push({
							json: responseData as IDataObject,
							pairedItem: { item: i },
						});

					} else if (operation === 'getAll') {
						// Get all jobs
						const requestOptions: IRequestOptions = {
							method: 'GET',
							url: '/api/v1/jobs',
							json: true,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'googleMapsScraperApi',
							requestOptions,
						);

						if (Array.isArray(responseData)) {
							responseData.forEach((job) => {
								returnData.push({
									json: job as IDataObject,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: responseData as IDataObject,
								pairedItem: { item: i },
							});
						}

					} else if (operation === 'delete') {
						// Delete job
						const jobId = this.getNodeParameter('jobId', i) as string;

						const requestOptions: IRequestOptions = {
							method: 'DELETE',
							url: `/api/v1/jobs/${jobId}`,
							json: true,
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'googleMapsScraperApi',
							requestOptions,
						);

						returnData.push({
							json: { success: true, jobId, message: 'Job deleted successfully' },
							pairedItem: { item: i },
						});

					} else if (operation === 'download') {
						// Download CSV results
						const jobId = this.getNodeParameter('jobId', i) as string;

						const requestOptions: IRequestOptions = {
							method: 'GET',
							url: `/api/v1/jobs/${jobId}/download`,
							encoding: null, // Get binary data
						};

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'googleMapsScraperApi',
							requestOptions,
						);

						// Convert buffer to string for CSV data
						const csvData = responseData.toString();

						returnData.push({
							json: { 
								jobId,
								filename: `job_${jobId}_results.csv`,
								data: csvData,
								mimeType: 'text/csv'
							},
							binary: {
								data: {
									data: responseData,
									mimeType: 'text/csv',
									fileName: `job_${jobId}_results.csv`,
								},
							},
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return this.prepareOutputData(returnData);
	}
}