import { FormGroup } from "@angular/forms";

export class FormUtil {

    public static getFormErrorMap(form: FormGroup): Map<string, string> {
        let rawValue = form.getRawValue();
        let formErrors: Map<string, string> = new Map();
        Object.keys(rawValue).forEach(key => {
            formErrors.set(key, "")
        });
        return formErrors;
    }

    public static validateForm(form: FormGroup, formErrors: Map<string, string>, formValidationMessages: Map<string, Map<string, string>>) {
        if (!form) {
            return;
        }
        formErrors.forEach((value, key, self) => {
            //clear previous error messsage(if any)
            self.set(key, '');
            const control = form.get(key);
            if (control && !control.valid) {
                const messages = formValidationMessages.get(key);
                for (const validationKey in control.errors) {
                    if (control.errors.hasOwnProperty(validationKey)) {
                        self.set(key, messages.get(validationKey) + ' ');
                    }
                }
            }
        })

        return formErrors;
    }

    public static getGenericFormValidators(form: FormGroup) {
        let formValidationMessages: Map<string, Map<string, string>> = new Map();
        let rawValue = form.getRawValue();
        Object.keys(rawValue).forEach(key => {
            formValidationMessages.set(key, new Map());
            let controlName: string = this.getControlNameFromCamelCase(key);

            //generic Validation Messages
            formValidationMessages.get(key).set('required', controlName + ' is Required')
            formValidationMessages.get(key).set('email', controlName + ' should be in valid email format')

        });
        return formValidationMessages;
    }

    static getControlNameFromCamelCase(controlName: string): string {
        let name: string;
        name = controlName.split(/(?=[A-Z])/).join(' ');
        name = name.substring(0,1).toUpperCase()+name.substring(1)
        return name??'';
    }
}
