import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'CustomValidateDate', async: false })
export class CustomValidDatetime implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const reg =
      /^(20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
    return reg.test(text);
  }
}
