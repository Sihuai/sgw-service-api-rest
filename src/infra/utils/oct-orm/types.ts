import * as Joi from 'joi'
import {
	AlternativesSchema,
	AnySchema,
	ArraySchema,
	BinarySchema,
	BooleanSchema,
	DateSchema,
	FunctionSchema,
	NumberSchema,
	ObjectSchema,
	Schema,
	StringSchema,
	ValidationOptions
} from 'joi'
import { enjoi } from './utils/enjoi';

// https://stackoverflow.com/questions/45306782/typescript-declaration-for-polymorphic-decorator
export interface ClassAndMethodDecorator {
	// Class decorator overload
	<TFunction extends Function>(target: TFunction): TFunction;

	// Property decorator overload
	<T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T>;
}

export interface ClassAndPropertyDecorator {
	// Class decorator overload
	<TFunction extends Function>(target: TFunction): TFunction;

	(target: Object, propertyKey: string | symbol): void
}
// declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;

export type Related<T = any> = T | any;

export type Abstract<T> = Function & {prototype: T};
export type Constructor<T> = new (...args: any[]) => T;
export type Class<T = {}> = Abstract<T> | Constructor<T>;

export type CollectionName = string;


export interface IndexOptions {
	// type?: ArangoDB.IndexType
	additionalFields?: string[]
	sparse?: boolean
	unique?: boolean
	deduplicate?: boolean
}

export interface DocumentData {
	[key: string]: any
}

export interface DocumentMap {
	forClient?: (doc: DocumentData, opt?: any) => DocumentData
	fromClient?: (doc: DocumentData, opt?: any) => DocumentData
}

export interface DocumentOptions extends DocumentMap {}

export enum LogLevel {
	Error = 1,
	Warn,
	Info,
	Debug
}

export interface Config {
	logLevel: LogLevel
	unregisterAQLFunctionEntityGroup: boolean
	dasherizeRoutes: boolean
	paramOperatorSeparator: string
	defaultLocale: string
	defaultCurrency: string
	defaultListLimit: number
	defaultListLimitMax: number
	prefixCollectionName: boolean
	exposeRouteFunctionsToSwagger: boolean
	addAttributeWritersToReaders: boolean
	stripDocumentId: boolean
	stripDocumentKey: boolean
	stripDocumentRev: boolean
	forClient: null | DocumentForClient
	fromClient: null | DocumentFromClient
}

export type RoutePreset = '*' | 'ALL' | 'ALL+' | 'CRUD' | 'CRUD+'
export type RouteDecorator = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'LIST'
export type RouteMethod = 'get' | 'post' | 'patch' | 'put' | 'delete'
export type RouteAction = 'create' | 'read' | 'update' | 'delete' | 'list'

// export type MetadataId = 'attribute' | 'index' | 'route'
// export type MetadataTypes = AttributeMetadata | IndexMetadata | RouteMetadata

export type Roles = string[];
export type RolesFunc = (returns?: void) => Roles;

// export interface Metadata<T> {
// 	id: MetadataId,
// 	attribute: string;
// 	data: T
// }

export interface DocumentAttribute {
	[key: string]: AttributeObject
}

export interface AttributeObject {
	attribute: string
	roles?: AttributeRoles
	schema?: Schema
	metadata?: any
}

export interface AttributeRoles {
	readers: Roles
	writers: Roles
}

export interface RoleAttributes {
	read: string[]
	write: string[]
}

export interface RoleObject {
	[key: string]: RoleAttributes
}

export type SchemaFunc = (enjoi: (type?: any) => typeof Joi | any, joi?: any) => typeof Joi | boolean | Object;

export interface SchemaStructure {
	[key: string]: Schema
}

export type DecoratorId = 'Attribute' | 'Authorized' | 'Description' | 'Index' | 'Collection' | 'Document' | 'Nested' | 'Route'
	| 'Route.auth' | 'Route.roles' | RelationType | EventDecorator | 'Task' | 'Function';
export type DecoratorStorage = {
	[key in DecoratorId]?: DecoratorObject[]
}
export interface DecoratorObject {
	decorator: DecoratorId
	prototype: any
	attribute?: string
	[key: string]: any
}

export type RelationType = 'OneToOne' | 'OneToMany';// | 'ManyToOne' | 'ManyToMany';

export interface Relation<T=any> {
	type: RelationType
	document: T
	attribute: string
}

export interface RelationStructure<T> {
	[key: string]: Relation<T>
}

export interface JoiContainer {
	schema: Schema
	opt: ValidationOptions
}

export type AnyJoiSchema = AnySchema
	& ArraySchema
	& AlternativesSchema
	& BinarySchema
	& BooleanSchema
	& DateSchema
	& FunctionSchema
	& NumberSchema
	& ObjectSchema
	& StringSchema
export type Enjoi = typeof enjoi;
export type ValidateSchema = Schema | JoiContainer;
export type ValidateSchemaFunc = (returns: AnyJoiSchema, enjoi: Enjoi) => AnyJoiSchema;

export interface RouteBaseOpt {
	deprecated?: boolean
	tags?: string[]
	summary?: string
	description?: string
}

export type DocumentForClient = (doc: DocumentData, opt: any) => DocumentData;
export type DocumentFromClient = (doc: DocumentData, opt: any) => DocumentData;

type QueryFilterOperator = '==' | '!=' | '<' | '<=' | '>' | '>=' | 'IN' | 'NOT IN' | 'LIKE' | '=~' | '!~' | 'HAS'
type QueryFilterValue = string | number | boolean | [QueryFilterOperator, ...(string | number | boolean)[]]
export interface QueryFilter {
	[key: string]: QueryFilterValue
}

export interface QueryOpt {
	collection?: string
	filter?: QueryFilter
	sort?: string[]
	limit?: number | [number, number]
	keep?: string[]
	unset?: string[]
}

export type EventDecorator =
	'After.document.class' | 'After.document.prop' |
	'Before.document.class' | 'Before.document.prop' |
	'After.insert.class' | 'After.insert.prop' |
	'Before.insert.class' | 'Before.insert.prop' |
	'After.update.class' | 'After.update.prop' |
	'Before.update.class' | 'Before.update.prop' |
	'After.replace.class' | 'After.replace.prop' |
	'Before.replace.class' | 'Before.replace.prop' |
	'After.modify.class' | 'After.modify.prop' |
	'Before.modify.class' | 'Before.modify.prop' |
	'After.write.class' | 'After.write.prop' |
	'Before.write.class' | 'Before.write.prop' |
	'After.remove.class' | 'After.remove.prop' |
	'Before.remove.class' | 'Before.remove.prop'

export type EventType =
	'After.document' | 'Before.document' |
	'After.insert' | 'Before.insert' |
	'After.update' | 'Before.update' |
	'After.modify' | 'Before.modify' |
	'After.write' | 'Before.write' |
	'After.replace' | 'Before.replace' |
	'After.remove' | 'Before.remove'

export type EventMethod = 'document' | 'insert' | 'update' | 'replace' | 'modify' | 'write' | 'remove'