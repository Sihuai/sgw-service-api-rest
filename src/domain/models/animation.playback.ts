import { Entity, Attribute } from "../../infra/utils/oct-orm";
import { BaseModel } from './base.model';

export class Animation {
  constructor() {
    this.tag = '';
    this.uri = '';
  }

  @Attribute()
  tag: string;
  @Attribute()
  uri: string;
}

export class PitStop {
    constructor() {
      this.name = '';
      this.animations = [];
    }

    @Attribute()
    name: string;
    @Attribute()
    animations: Animation[];
}

export class Icon {
  constructor() {
    this.sequence = -1;
    this.tag = '';
    this.uri = '';
  }

  @Attribute()
  sequence: number;
  @Attribute()
  tag: string;
  @Attribute()
  uri: string;
}

export class Button extends Icon {
  constructor() {
    super();
    this.isNext = false;
  }

  @Attribute()
  isNext: boolean;
}

@Entity('AnimationPlayback')
export class AnimationPlayback extends BaseModel {
    constructor() {
        super();
        this.type = '';
        this.orientation = '';
        this.nextPitStop = new PitStop();
        this.buttons = [];
        this.icons = [];
    }

    @Attribute()
    type: string;
    @Attribute()
    orientation: string;
    @Attribute()
    nextPitStop: PitStop;
    @Attribute()
    buttons: Button[];
    @Attribute()
    icons: Icon[];
}