import { Attribute, Entity, Type } from "type-arango";

export declare class BaseModel extends Entity {
    @Attribute()
    _isActive?: boolean;
    @Attribute()
    _datetimeCreated?: Type.DateInsert;
    @Attribute()
    _datetimeLastEdited?: Type.DateUpdate;
    @Attribute()
    _userCreated?: string;
    @Attribute()
    _userLastUpdated?: string;
}
export {};