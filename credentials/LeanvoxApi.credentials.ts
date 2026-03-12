import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LeanvoxApi implements ICredentialType {
	name = 'leanvoxApi';
	displayName = 'LeanVox API';
	documentationUrl = 'https://leanvox.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'lvx_...',
			description: 'Your LeanVox API key (starts with lvx_)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.leanvox.com',
			url: '/v1/balance',
			method: 'GET',
		},
	};
}
