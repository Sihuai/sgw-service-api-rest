import { Attribute, Entity, Type } from "type-arango";

export class BaseModel extends Entity {
    constructor() {
        super();
        this.isActive = false;
        this.datetimeCreated = '1900-01-01';
        this.datetimeLastEdited = '1900-01-01';
        this.userCreated = '';
        this.userLastUpdated = '';
    }

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
// export {};