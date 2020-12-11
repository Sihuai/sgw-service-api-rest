import moment from "moment";
import { Attribute } from "../../infra/utils/oct-orm";
import { Type } from "../../infra/utils/oct-orm/models/type.models";

export class BaseModel {
    constructor() {
        this._id = '';
        this._key = '';
        this._rev = '';
        this._from = '';
        this._to = '';
        this.isActive = true;
        this.datetimeCreated = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        this.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        this.userCreated = '';
        this.userLastUpdated = '';
    }

    _id: string;
    _key: string;
    _rev: string;
    _from: string;
	_to: string;
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