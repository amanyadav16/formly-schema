import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import data from '../assets/json-schema/mySchema.json';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  tempMappedField: any;
  form: FormGroup;
  model: any;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];

  constructor(
    private formlyJsonschema: FormlyJsonschema,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.form = new FormGroup({});
    this.options = {};
    this.fields = [
      this.formlyJsonschema.toFieldConfig(data.schema, {
        map: (mappedField: FormlyFieldConfig) => {
          mappedField.validation = { show: false };
          if (mappedField.type === 'enum') {
            if (mappedField.props?.minItems || mappedField.props?.maxItems) {
              this.tempMappedField = mappedField;
              mappedField.validators!.validation =
                this.getMultiSelectValidators(
                  mappedField.props.minItems != undefined,
                  mappedField.props.maxItems != undefined
                );
              mappedField.defaultValue = [];
            }
          }
          return mappedField;
        },
      }),
    ];
    this.model = {};
  }

  getMultiSelectValidators(minValidate: any, maxValidate: any) {
    let result = null;
    if (minValidate && maxValidate) {
      result = ['multi-select-min', 'multi-select-max'];
      delete this.tempMappedField.validators.minItems;
      delete this.tempMappedField.validators.maxItems;
    } else if (minValidate) {
      result = ['multi-select-min'];
      delete this.tempMappedField.validators.minItems;
    } else if (maxValidate) {
      result = ['multi-select-max'];
      delete this.tempMappedField.validators.maxItems;
    }
    return result;
  }

  submit() {
    alert(JSON.stringify(this.model));
  }
}
