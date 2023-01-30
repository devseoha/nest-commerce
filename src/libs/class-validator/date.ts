import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'CustomValidateDate', async: false })
export class CustomValidateDate implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const reg =
      /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
    return reg.test(text);
  }
}
