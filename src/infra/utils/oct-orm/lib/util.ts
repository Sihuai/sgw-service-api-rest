import { Metadata } from "../metadata/MetadataManager";
import { ENTITY_ATTRIBUTES } from "../keys/entity.keys";
import { ArrayOr } from "../types/arrayOrType";
import { DocumentMetadata, EdgeData } from "arangojs/documents";

export function getEntityAttributesForCreate(entity: Function) {
  return [
    { key: "isActive", as: "isActive" },
    { key: "datetimeCreated", as: "datetimeCreated" },
    { key: "datetimeLastEdited", as: "datetimeLastEdited" },
    { key: "userCreated", as: "userCreated" },
    { key: "userLastUpdated", as: "userLastUpdated" }
  ].concat(Metadata.get(entity, ENTITY_ATTRIBUTES));
}

export function getEntityAttributesForUpdate(entity: Function) {
  return [
    { key: "_key", as: "_key" },
    { key: "isActive", as: "isActive" },
    { key: "datetimeLastEdited", as: "datetimeLastEdited" },
    { key: "userLastUpdated", as: "userLastUpdated" }
  ].concat(Metadata.get(entity, ENTITY_ATTRIBUTES));
}

export function getEntityAttributesForEdgeCreate(entity: Function) {
  return [
    { key: "_from", as: "_from" },
    { key: "_to", as: "_to" },
    { key: "isActive", as: "isActive" },
    { key: "datetimeCreated", as: "datetimeCreated" },
    { key: "datetimeLastEdited", as: "datetimeLastEdited" },
    { key: "userCreated", as: "userCreated" },
    { key: "userLastUpdated", as: "userLastUpdated" }
  ].concat(Metadata.get(entity, ENTITY_ATTRIBUTES));
}

export function getEntityAttributesForRead(entity: Function) {
  return [
    { key: "_key", as: "_key" },
    { key: "_id", as: "_id" },
    { key: "_rev", as: "_rev" },
    { key: "_from", as: "_from" },
    { key: "_to", as: "_to" },
    { key: "isActive", as: "isActive" },
    { key: "datetimeCreated", as: "datetimeCreated" },
    { key: "datetimeLastEdited", as: "datetimeLastEdited" },
    { key: "userCreated", as: "userCreated" },
    { key: "userLastUpdated", as: "userLastUpdated" }
  ].concat(Metadata.get(entity, ENTITY_ATTRIBUTES));
}

export function getEntitySimpleAttributesForRead(entity: Function) {
  return [
    { key: "_key", as: "_key" },
    { key: "_from", as: "_from" },
    { key: "_to", as: "_to" },
  ].concat(Metadata.get(entity, ENTITY_ATTRIBUTES));
}

export function normalizeDataForRead<T>(entity: Function, data: Object | Object[]): T[] | T {
  const attrs = getEntityAttributesForRead(entity);

  if (Array.isArray(data))
    return data.map(item => normalizeDataForRead(entity, item)) as T[];

  return attrs.reduce((obj, attr) => {
    if (attr.key in data) obj[attr.as] = data[attr.key];
    return obj;
  }, {}) as T;
}

export function normalizeSimpleDataForRead<T>(entity: Function, data: Object | Object[]): T[] | T {
  const attrs = getEntitySimpleAttributesForRead(entity);

  if (Array.isArray(data))
    return data.map(item => normalizeSimpleDataForRead(entity, item)) as T[];

  return attrs.reduce((obj, attr) => {
    if (attr.key in data) obj[attr.as] = data[attr.key];
    return obj;
  }, {}) as T;
}

export function normalizeDataForCreate<T = object>(entity, data: T): DocumentMetadata;
export function normalizeDataForCreate<T = object>(entity, data: T[]): DocumentMetadata[];
export function normalizeDataForCreate<T = object>(entity, data: ArrayOr<T>): ArrayOr<DocumentMetadata> {
  const attrs = getEntityAttributesForCreate(entity);

  if (Array.isArray(data))
    return data.map(item => normalizeDataForCreate(entity, item));

  return attrs.reduce((obj, attr) => {
    if (attr.as in data) obj[attr.key] = data[attr.as];
    return obj;
  }, {}) as DocumentMetadata;
}

export function normalizeDataForUpdate<T = object>(entity, data: T): DocumentMetadata;
export function normalizeDataForUpdate<T = object>(entity, data: T[]): DocumentMetadata[];
export function normalizeDataForUpdate<T = object>(entity, data: ArrayOr<T>): ArrayOr<DocumentMetadata> {
  const attrs = getEntityAttributesForUpdate(entity);

  if (Array.isArray(data))
    return data.map(item => normalizeDataForUpdate(entity, item));

  return attrs.reduce((obj, attr) => {
    if (attr.as in data) obj[attr.key] = data[attr.as];
    return obj;
  }, {}) as DocumentMetadata;
}

export function normalizeEdgeForCreate<T = object>(entity, data: T): EdgeData;
export function normalizeEdgeForCreate<T = object>(entity, data: T[]): EdgeData[];
export function normalizeEdgeForCreate<T = object>(entity, data: ArrayOr<T>): ArrayOr<EdgeData> {
  const attrs = getEntityAttributesForEdgeCreate(entity);

  if (Array.isArray(data))
    return data.map(item => normalizeEdgeForCreate(entity, item));

  return attrs.reduce((obj, attr) => {
    if (attr.as in data) obj[attr.key] = data[attr.as];
    return obj;
  }, {}) as EdgeData;
}