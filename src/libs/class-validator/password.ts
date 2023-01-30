import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'CustomValidatePassword', async: false })
export class CustomValidatePassword implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return reg.test(text);
    }
}