import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AnimationService } from '../../../app/service/animation.service';
import { IOC_TYPE } from '../../../config/type';
import { IAnimationDTO } from '../../../domain/dtos/i.animation.dto';
import { Animation, Button, Icon, PitStop } from '../../../domain/models/animation';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<IAnimationDTO> {
  type: string;
  orientation: string;
  nextPitStop: PitStop;
  buttons: Button[];
  icons: Icon[];
}

@provide(IOC_TYPE.CreateAnimationAction, true)
@provide('action', true)
export class CreateAnimationAction implements IAction {
  payloadExample = ` `;
  description = '';
  constructor(
    @inject(IOC_TYPE.AnimationServiceImpl) private animationService: AnimationService,
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
      if (isEmptyObject(button.styles) == true) return -103; // Button styles is empty!

      for (let style of button.styles) {
        if (isEmptyObject(style.type) == true) return -104; // Button style type is empty!
        if (isEmptyObject(style.parameters) == true) return -105; // Button style parameters is empty!
        if (isEmptyObject(style.parameters.top) == true) return -106; // Button style parameters top is empty!
        if (isEmptyObject(style.parameters.left) == true) return -107; // Button style parameters left is empty!
        if (style.parameters.width < 0) return -108; // Button style parameters width less than zero!
        if (style.parameters.height < 0) return -109; // Button style parameters height less than zero!
        if (style.parameters.zIndex < 0) return -110; // Button style parameters zIndex less than zero!
      }

      if (isEmptyObject(button.location) == true) return -111; // Button location is empty!
      if (button.location.x < 0) return -112; // Button location x less than zero!
      if (button.location.y < 0) return -113; // Button location y less than zero!

      if (button.isNext == true) isNextTrueCount++;

      if (tmpSequence.includes(button.sequence) == true) return -114; // Button sequence has repeat no.!
      tmpSequence.push(button.sequence);
    }

    if (isNextTrueCount > 1) return -115; // Button isNext have repeat True!

    var tmpSequence: Array<number> = [];
    for (let icon of request.icons) {
      if (icon.sequence < 0) return -116; // Icon sequence less than zero!
      if (isEmptyObject(icon.tag) == true) return -117; // Icon tag is empty!
      if (isEmptyObject(icon.uri) == true) return -118; // Icon uri is empty!
      if (isEmptyObject(icon.styles) == true) return -119; // Icon styles is empty!

      for (let style of icon.styles) {
        if (isEmptyObject(style.type) == true) return -120; // Icon style type is empty!
        if (isEmptyObject(style.parameters) == true) return -121; // Icon style parameters is empty!
        if (isEmptyObject(style.parameters.top) == true) return -122; // Icon style parameters top is empty!
        if (isEmptyObject(style.parameters.left) == true) return -123; // Icon style parameters left is empty!
        if (style.parameters.width < 0) return -124; // Icon style parameters width less than zero!
        if (style.parameters.height < 0) return -125; // Icon style parameters height less than zero!
        if (style.parameters.zIndex < 0) return -126; // Icon style parameters zIndex less than zero!
      }

      if (tmpSequence.includes(icon.sequence) == true) return -127; // Icon sequence has repeat no.!
      tmpSequence.push(icon.sequence);
    }

    const model = new Animation();
    model.type = request.type;
    model.orientation = request.orientation;
    model.nextPitStop = request.nextPitStop;
    model.buttons = request.buttons;
    model.icons = request.icons;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;
    
    return await this.animationService.addOne(model);
  }
}