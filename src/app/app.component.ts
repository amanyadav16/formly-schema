import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import data from '../assets/json-schema/mySchema.json';
import traverse = require('json-schema-traverse');

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
  supportFields = ['string', 'integer', 'boolean', 'number', 'array'];

  constructor(
    private formlyJsonschema: FormlyJsonschema,
    private http: HttpClient
  ) {}

  schema2 = {
    properties: {
      foo: { type: 'string' },
      bar: { type: 'integer' },
    },
  };

  ngOnInit() {
    this.form = new FormGroup({});
    this.options = {};
    this.fields = [
      this.formlyJsonschema.toFieldConfig(this.prepareJsonFields(data.schema), {
        map: (mappedField: FormlyFieldConfig) => {
          mappedField.validation = { show: false };
          if (mappedField.type == 'string') {
            // console.log(mappedField)
          }
          return mappedField;
        },
      }),
    ];
    this.model = {};
    //  console.log(this.prepareJsonFields(data.schema));
  }
  count = 1;
  prepareJsonFields(json: any) {
    const self = this;
    traverse(json, { allKeys: true }, (subSchema: any) => {
      if (self.supportFields.find((data) => data == subSchema.type)) {
        if (subSchema.cannotBeUpdated === true) {
          console.log(this.count++);
          subSchema.readOnly = true;
        } else {
          subSchema.readOnly = false;
        }
      }
    });
    return json;
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
