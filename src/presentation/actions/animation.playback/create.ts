import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { boolean } from 'joi';
import { AnimationPlaybackService } from '../../../app/service/animation.playback.service';
import { IOC_TYPE } from '../../../config/type';
import { IAnimationPlaybackDTO } from '../../../domain/dtos/i.animation.playback.dto';
import { AnimationPlayback, Button, Icon, PitStop } from '../../../domain/models/animation.playback';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IAnimationPlaybackDTO> {
  type: string;
  orientation: string;
  nextPitStop: PitStop;
  buttons: Button[];
  icons: Icon[];
}

@provide(IOC_TYPE.CreateAnimationPlaybackAction, true)
@provide('action', true)
export class CreateAnimationPlaybackAction implements IAction {
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
      if (isEmptyObject(button.style) == true) return -103; // Button style is empty!
      if (isEmptyObject(button.style.normal) == true) return -104; // Button style normal is empty!
      if (isEmptyObject(button.style.normal.top) == true) return -105; // Button style normal top is empty!
      if (isEmptyObject(button.style.normal.left) == true) return -106; // Button style normal left is empty!
      if (button.style.normal.width < 0) return -107; // Button style normal width less than zero!
      if (button.style.normal.height < 0) return -108; // Button style normal height less than zero!
      if (isEmptyObject(button.location) == true) return -109; // Button location is empty!
      if (button.location.x < 0) return -110; // Button location x less than zero!
      if (button.location.y < 0) return -111; // Button location y less than zero!

      if (button.isNext == true) isNextTrueCount++;

      if (tmpSequence.includes(button.sequence) == true) return -112; // Button sequence has repeat no.!
      tmpSequence.push(button.sequence);
    }

    if (isNextTrueCount > 1) return -113; // Button isNext have repeat True!

    var tmpSequence: Array<number> = [];
    for (let icon of request.icons) {
      if (icon.sequence < 0) return -114; // Icon sequence less than zero!
      if (isEmptyObject(icon.tag) == true) return -115; // Icon tag is empty!
      if (isEmptyObject(icon.uri) == true) return -116; // Icon uri is empty!
      if (isEmptyObject(icon.style) == true) return -117; // Icon style is empty!
      if (isEmptyObject(icon.style.normal) == true) return -118; // Icon style normal is empty!
      if (isEmptyObject(icon.style.normal.top) == true) return -119; // Icon style normal top is empty!
      if (isEmptyObject(icon.style.normal.left) == true) return -120; // Icon style normal left is empty!
      if (icon.style.normal.width < 0) return -121; // Icon style normal width less than zero!
      if (icon.style.normal.height < 0) return -122; // Icon style normal height less than zero!

      if (tmpSequence.includes(icon.sequence) == true) return -123; // Icon sequence has repeat no.!
      tmpSequence.push(icon.sequence);
    }

    const model = new AnimationPlayback();
    model.type = request.type;
    model.orientation = request.orientation;
    model.nextPitStop = request.nextPitStop;
    model.buttons = request.buttons;
    model.icons = request.icons;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.animationPlaybackService.addOne(model);
  }
}