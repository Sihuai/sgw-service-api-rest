import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { Type } from "../../infra/utils/oct-orm/models/type.models";

@Entity()
export class BaseModel {
    constructor() {
        this._id = '';
        this._key = '';
        this._rev = '';
        this.isActive = false;
        this.datetimeCreated = '1900-01-01';
        this.datetimeLastEdited = '1900-01-01';
        this.userCreated = '';
        this.userLastUpdated = '';
    }

    @Attribute()
    public _id?: string;
    @Attribute()
    public _key?: string;
    @Attribute()
	public _rev?: string;
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