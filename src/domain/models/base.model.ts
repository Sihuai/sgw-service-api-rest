import { Attribute } from "../../infra/utils/oct-orm";
import { Type } from "../../infra/utils/oct-orm/models/type.models";

export class BaseModel {
    constructor() {
        this._id = '';
        this._key = '';
        this._rev = '';
        this._from = '';
        this._to = '';
        this.isActive = false;
        this.datetimeCreated = '1900-01-01';
        this.datetimeLastEdited = '1900-01-01';
        this.userCreated = '';
        this.userLastUpdated = '';
    }

    _id: string;
    _key: string;
    _rev: string;
    _from: string;
	_to?: string;
    @Attribute()
    isActive: boolean;
    @Attribute()
    datetimeCreated: Type.DateInsert;
    @Attribute()
    datetimeLastEdited: Type.DateUpdate;
    @Attribute()
    userCreated: string;
    @Attribute()
    userLastUpdated: string;
}