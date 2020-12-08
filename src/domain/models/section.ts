import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { Pagination } from "../../infra/utils/oct-orm/models/pagination";
import { BaseModel } from './base.model';
import { Trail } from './trail';

@Entity('Section')
export class Section extends BaseModel {
    constructor() {
        super();
        this.sequence = -1;
        this.header = '';
        this.uri = '';
        this.color = '';
        this.trails = [];
        this.pagination = new Pagination();
    }

    @HashIndex({ unique: true, name: 'ix_section_sequence' })
    @Attribute()
    sequence: number;
    @Attribute()
    header: string;
    @Attribute()
    uri: string;
    @Attribute()
    color: string;
    @Attribute()
    // @OneToMany(type => Trail, Trail => Trail.owner)
    // trails: Related<Trail[]>;
    // // @OneToOne(type => Pagination, Pagination => Pagination.owner)
    trails: Trail[];
    pagination: Pagination;
}

export interface ISectionMainFields {
    body: string;
}
  
export interface ISectionDTO extends ISectionMainFields {
    references: number[];
    threadId: number;
}