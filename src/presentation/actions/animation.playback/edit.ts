import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { AnimationPlaybackService } from '../../../app/service/animation.playback.service';
import { IOC_TYPE } from '../../../config/type';
import { IAnimationPlaybackDTO } from '../../../domain/dtos/i.animation.playback.dto';
import { AnimationPlayback, Button, Icon, PitStop } from '../../../domain/models/animation.playback';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IAnimationPlaybackDTO> {
  _key: string;
  type: string;
  orientation: string;
  nextPitStop: PitStop;
  buttons: Button[];
  icons: Icon[];
}

@provide(IOC_TYPE.EditAnimationPlaybackAction, true)
@provide('action', true)
export class EditAnimationPlaybackAction implements IAction {
  payloadExample = ` `;
  description = '';
  constructor(
    @inject(IOC_TYPE.AnimationPlaybackServiceImpl) private animationPlaybackService: AnimationPlaybackService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {
    if (isEmptyObject(request.type) == true) return -1; // Type is empty!
    if (isEmptyObject(request.orientation) == true) return -2; // Orientation is empty!
    if (isEmptyObject(request.nextPitStop) == true) return -3; // Next Pit Stop is empty!
    if (isEmptyObject(request.buttons) == true) return -4; // Buttons is empty!
    if (isEmptyObject(request.icons) == true) return -5; // Icons is empty!

    if (isEmptyObject(request.nextPitStop.name) == true) return -6; // Next Pit Stop name is empty!
    if (isEmptyObject(request.nextPitStop.animations) == true) return -7; // Next Pit Stop animations is empty!

    for (let animation of request.nextPitStop.animations) {
      if (isEmptyObject(animation.tag) == true) return -8; // Next Pit Stop animations tag is empty!
      if (isEmptyObject(animation.uri) == true) return -9; // Next Pit Stop animations uri is empty!
    }

    var isNextTrueCount = 0;
    var tmpSequence: Array<number> = [];
    for (let button of request.buttons) {
      if (button.sequence < 0) return -100; // Button sequence less than zero!
      if (isEmptyObject(button.tag) == true) return -101; // Button tag is empty!
      if (isEmptyObject(button.uri) == true) return -102; // Button uri is empty!

      if (button.isNext == true) isNextTrueCount++;

      if (tmpSequence.includes(button.sequence) == true) return -103; // Button sequence has repeat no.!
      tmpSequence.push(button.sequence);
    }

    if (isNextTrueCount > 1) return -104; // Button isNext have repeat True!

    var tmpSequence: Array<number> = [];
    for (let icon of request.icons) {
      if (icon.sequence < 0) return -105; // Icon sequence less than zero!
      if (isEmptyObject(icon.tag) == true) return -106; // Icon tag is empty!
      if (isEmptyObject(icon.uri) == true) return -107; // Icon uri is empty!

      if (tmpSequence.includes(icon.sequence) == true) return -108; // Icon sequence has repeat no.!
      tmpSequence.push(icon.sequence);
    }

    if (isEmptyObject(request._key) == true) return -109; // AnimationPlayback key is empty!

    const model = new AnimationPlayback();
    model.type = request.type;
    model.orientation = request.orientation;
    model.nextPitStop = request.nextPitStop;
    model.buttons = request.buttons;
    model.icons = request.icons;
    model._key = request._key;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;
    
    return await this.animationPlaybackService.editOne(model);
  }
}