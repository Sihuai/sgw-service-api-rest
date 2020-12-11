import { Entity, Attribute, HashIndex } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';
import { Media } from './media';

@Entity('Trail')
export class Trail extends BaseModel {
    constructor() {
        super();
        this.sequence = -1;
        this.title = '';
        this.media = new Media();
    }

    @HashIndex({ unique: true, name: 'ix_trail_sequence' })
    @Attribute()
    sequence: number;
    @Attribute()
    title: string;
    @Attribute()
    media: Media;
}