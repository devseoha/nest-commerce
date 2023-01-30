import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'CustomValidateTargetAge', async: false })
export class CustomValidateTargetAge implements ValidatorConstraintInterface {
  validate(text: [], args: ValidationArguments) {
    const reg = /[1-4][0]$/;
    let result = true;
    for (let i = 0; i < text.length; i++) {
      if (!reg.test(text[i])) {
        result = false;
        break;
      }
    }

    return result;
  }
}
