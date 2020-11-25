import { Config, LogLevel } from './types';

export * from './Connection'
export * from './Repository'
export * from './decorators'
export * from './types'

export const config: Config = {
	logLevel: LogLevel.Warn,
	prefixCollectionName: false,
	exposeRouteFunctionsToSwagger: false,
	dasherizeRoutes: true,
	paramOperatorSeparator: '|',
	stripDocumentId: true,
	stripDocumentRev: true,
	stripDocumentKey: false,
	unregisterAQLFunctionEntityGroup: true,
	addAttributeWritersToReaders: true,
	defaultLocale: 'en',
	defaultCurrency: 'USD',
	defaultListLimit: 25,
	defaultListLimitMax: 100,
	forClient: null,
	fromClient: null,
};