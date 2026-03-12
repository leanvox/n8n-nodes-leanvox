import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class Leanvox implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LeanVox',
		name: 'leanvox',
		icon: 'file:leanvox.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'LeanVox TTS & STT API',
		defaults: {
			name: 'LeanVox',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'leanvoxApi',
				required: true,
			},
		],
		properties: [
			// ------ Resource ------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Speech', value: 'speech' },
					{ name: 'Audio', value: 'audio' },
					{ name: 'Voices', value: 'voices' },
					{ name: 'Account', value: 'account' },
				],
				default: 'speech',
			},

			// ------ Operations ------
			// Speech operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['speech'] } },
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate speech from text (synchronous)',
						action: 'Generate speech from text',
					},
					{
						name: 'Generate Async',
						value: 'generateAsync',
						description: 'Generate speech from text (asynchronous)',
						action: 'Generate speech asynchronously',
					},
					{
						name: 'Check Job',
						value: 'checkJob',
						description: 'Check the status of an async TTS job',
						action: 'Check async job status',
					},
					{
						name: 'Dialogue',
						value: 'dialogue',
						description: 'Generate multi-speaker dialogue',
						action: 'Generate multi speaker dialogue',
					},
				],
				default: 'generate',
			},
			// Audio operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['audio'] } },
				options: [
					{
						name: 'Transcribe',
						value: 'transcribe',
						description: 'Transcribe audio to text',
						action: 'Transcribe audio to text',
					},
				],
				default: 'transcribe',
			},
			// Voices operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['voices'] } },
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'List available voices',
						action: 'List available voices',
					},
					{
						name: 'List Curated',
						value: 'listCurated',
						description: 'List curated voices with previews',
						action: 'List curated voices with previews',
					},
				],
				default: 'list',
			},
			// Account operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{
						name: 'Check Balance',
						value: 'checkBalance',
						description: 'Check credit balance',
						action: 'Check credit balance',
					},
				],
				default: 'checkBalance',
			},

			// ------ Fields ------

			// Speech > Generate / Generate Async shared fields
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: '',
				description: 'The text to convert to speech',
				displayOptions: {
					show: {
						resource: ['speech'],
						operation: ['generate', 'generateAsync'],
					},
				},
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				required: true,
				options: [
					{ name: 'Max', value: 'max' },
					{ name: 'Turbo', value: 'turbo' },
				],
				default: 'turbo',
				description: 'The TTS model to use',
				displayOptions: {
					show: {
						resource: ['speech'],
						operation: ['generate', 'generateAsync'],
					},
				},
			},
			{
				displayName: 'Voice',
				name: 'voice',
				type: 'string',
				required: true,
				default: '',
				description: 'The voice ID to use for synthesis',
				displayOptions: {
					show: {
						resource: ['speech'],
						operation: ['generate', 'generateAsync'],
					},
				},
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'Optional language code (e.g. en, es, fr)',
				displayOptions: {
					show: {
						resource: ['speech'],
						operation: ['generate', 'generateAsync'],
					},
				},
			},
			{
				displayName: 'Voice Instructions',
				name: 'voiceInstructions',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Custom voice instructions (only valid with model "max")',
				displayOptions: {
					show: {
						resource: ['speech'],
						operation: ['generate', 'generateAsync'],
						model: ['max'],
					},
				},
			},

			// Speech > Check Job
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				default: '',
				description: 'The async job ID to check',
				displayOptions: {
					show: {
						resource: ['speech'],
						operation: ['checkJob'],
					},
				},
			},

			// Speech > Dialogue
			{
				displayName: 'Lines',
				name: 'lines',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				required: true,
				default: {},
				description: 'Dialogue lines with text and voice',
				displayOptions: {
					show: {
						resource: ['speech'],
						operation: ['dialogue'],
					},
				},
				options: [
					{
						name: 'lineValues',
						displayName: 'Line',
						values: [
							{
								displayName: 'Text',
								name: 'text',
								type: 'string',
								default: '',
								description: 'The dialogue line text',
							},
							{
								displayName: 'Voice',
								name: 'voice',
								type: 'string',
								default: '',
								description: 'The voice ID for this line',
							},
						],
					},
				],
			},

			// Audio > Transcribe
			{
				displayName: 'Input Data Field Name',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				default: 'data',
				description: 'The name of the input field containing the binary audio data',
				displayOptions: {
					show: {
						resource: ['audio'],
						operation: ['transcribe'],
					},
				},
			},
			{
				displayName: 'Features',
				name: 'features',
				type: 'multiOptions',
				default: [],
				description: 'Additional transcription features to enable',
				options: [
					{ name: 'Diarization', value: 'diarization' },
					{ name: 'Summary', value: 'summary' },
				],
				displayOptions: {
					show: {
						resource: ['audio'],
						operation: ['transcribe'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: unknown;

				// ---- Speech ----
				if (resource === 'speech') {
					if (operation === 'generate' || operation === 'generateAsync') {
						const text = this.getNodeParameter('text', i) as string;
						const model = this.getNodeParameter('model', i) as string;
						const voice = this.getNodeParameter('voice', i) as string;
						const language = this.getNodeParameter('language', i) as string;
						const body: Record<string, unknown> = { text, model, voice };

						if (language) {
							body.language = language;
						}

						if (model === 'max') {
							const voiceInstructions = this.getNodeParameter(
								'voiceInstructions',
								i,
								'',
							) as string;
							if (voiceInstructions) {
								body.voice_instructions = voiceInstructions;
							}
						}

						const endpoint =
							operation === 'generate'
								? '/v1/tts/generate'
								: '/v1/tts/generate/async';

						if (operation === 'generate') {
							// Sync TTS returns audio binary
							const response = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'leanvoxApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `https://api.leanvox.com${endpoint}`,
									body,
									json: true,
									returnFullResponse: true,
									encoding: 'arraybuffer',
								},
							);

							const contentType =
								(response.headers?.['content-type'] as string) ?? 'audio/mpeg';

							// If response is JSON (e.g. error or metadata), return as JSON
							if (contentType.includes('application/json')) {
								const jsonStr =
									response.body instanceof Buffer
										? response.body.toString('utf8')
										: String(response.body);
								responseData = JSON.parse(jsonStr);
							} else {
								// Binary audio response
								const binaryData = await this.helpers.prepareBinaryData(
									Buffer.from(response.body as Buffer),
									'output.mp3',
									contentType,
								);
								returnData.push({
									json: { success: true },
									binary: { data: binaryData },
								});
								continue;
							}
						} else {
							responseData = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'leanvoxApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `https://api.leanvox.com${endpoint}`,
									body,
									json: true,
								},
							);
						}
					} else if (operation === 'checkJob') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'leanvoxApi',
							{
								method: 'GET' as IHttpRequestMethods,
								url: `https://api.leanvox.com/v1/tts/jobs/${jobId}`,
								json: true,
							},
						);
					} else if (operation === 'dialogue') {
						const linesData = this.getNodeParameter('lines.lineValues', i, []) as Array<{
							text: string;
							voice: string;
						}>;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'leanvoxApi',
							{
								method: 'POST' as IHttpRequestMethods,
								url: 'https://api.leanvox.com/v1/tts/dialogue',
								body: { lines: linesData },
								json: true,
							},
						);
					}
				}

				// ---- Audio ----
				if (resource === 'audio' && operation === 'transcribe') {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const features = this.getNodeParameter('features', i) as string[];

					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

					const formData: Record<string, unknown> = {
						file: {
							value: dataBuffer,
							options: {
								filename: binaryData.fileName ?? 'audio.wav',
								contentType: binaryData.mimeType ?? 'audio/wav',
							},
						},
					};

					if (features.length > 0) {
						formData.features = features.join(',');
					}

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'leanvoxApi',
						{
							method: 'POST' as IHttpRequestMethods,
							url: 'https://api.leanvox.com/v1/audio/transcribe',
							formData,
						},
					);

					// Parse if string
					if (typeof responseData === 'string') {
						try {
							responseData = JSON.parse(responseData);
						} catch {
							// leave as string
						}
					}
				}

				// ---- Voices ----
				if (resource === 'voices') {
					const endpoint =
						operation === 'listCurated' ? '/v1/voices/curated' : '/v1/voices';
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'leanvoxApi',
						{
							method: 'GET' as IHttpRequestMethods,
							url: `https://api.leanvox.com${endpoint}`,
							json: true,
						},
					);
				}

				// ---- Account ----
				if (resource === 'account' && operation === 'checkBalance') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'leanvoxApi',
						{
							method: 'GET' as IHttpRequestMethods,
							url: 'https://api.leanvox.com/v1/balance',
							json: true,
						},
					);
				}

				// Push JSON result
				if (Array.isArray(responseData)) {
					for (const item of responseData) {
						returnData.push({ json: item as IDataObject });
					}
				} else {
					returnData.push({ json: (responseData ?? {}) as IDataObject });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
