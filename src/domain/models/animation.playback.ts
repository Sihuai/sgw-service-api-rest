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

export class Normal {
  constructor() {
    this.top = '';
    this.left = '';
    this.width = 0;
    this.height = 0;
  }

  @Attribute()
  top: string;
  @Attribute()
  left: string;
  @Attribute()
  width: number;
  @Attribute()
  height: number;
}

export class Style {
  constructor() {
    this.normal = new Normal();
  }

  @Attribute()
  normal: Normal;
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
    this.style = new Style();
  }

  @Attribute()
  sequence: number;
  @Attribute()
  tag: string;
  @Attribute()
  uri: string;
  @Attribute()
  style: Style;
}

export class Location {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  @Attribute()
  x: number;
  @Attribute()
  y: number;
}

export class Button extends Icon {
  constructor() {
    super();
    this.isNext = false;
    this.style = new Style();
    this.location = new Location();
  }

  @Attribute()
  isNext: boolean;
  @Attribute()
  style: Style;
  @Attribute()
  location: Location;
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