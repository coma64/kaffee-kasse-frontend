import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeverageType } from '@models/beverage-type';
import { BeverageTypeService } from '@services/beverageType/beverage-type.service';
import { forkJoin } from 'rxjs';
import { switchMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-beverage-type-list',
  templateUrl: './beverage-type-list.component.html',
  styleUrls: ['./beverage-type-list.component.scss'],
})
export class BeverageTypeListComponent implements OnInit {
  private beverageTypes?: BeverageType[];

  beverageTypesForm?: FormArray;

  constructor(
    private beverageTypeService: BeverageTypeService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.beverageTypeService.getBeverageTypes().subscribe((beverageTypes) => {
      this.beverageTypes = beverageTypes;
      this.initBeverageTypeForm();
    });
  }

  private initBeverageTypeForm(): void {
    if (this.beverageTypes == undefined) return;

    this.beverageTypesForm = this.formBuilder.array(
      this.beverageTypes.map((beverageType) =>
        this.formBuilder.group({
          id: [beverageType.id],
          name: [beverageType.name, Validators.required],
          price: [beverageType.price.toFixed(2), Validators.required],
          shouldBeDeleted: [false],
        })
      )
    );
  }

  get beverageTypesFormControls(): FormGroup[] | undefined {
    return this.beverageTypesForm?.controls as FormGroup[] | undefined;
  }

  onSubmit(): void {
    if (
      this.beverageTypesForm == undefined ||
      this.beverageTypesFormControls == undefined ||
      this.beverageTypes == undefined ||
      this.beverageTypesForm.invalid ||
      this.beverageTypesForm.length === 0
    )
      return;

    const parseControlValue = (control: FormGroup): BeverageType => {
      return {
        id: parseInt(control.value.id),
        name: control.value.name,
        price: parseFloat(control.value.price),
      };
    };

    const beverageTypeUpdates = this.beverageTypesFormControls
      .filter((control) => control.touched && !isNaN(control.value.id))
      .map((control) => {
        const beverageType = parseControlValue(control);

        return this.beverageTypeService.updateBeverageType(beverageType);
      });

    const beverageTypeCreations = this.beverageTypesFormControls
      .filter(
        (control) =>
          control.touched &&
          isNaN(control.value.id) &&
          !control.value.shouldBeDeleted
      )
      .map((control) => {
        const beverageType = parseControlValue(control);

        return this.beverageTypeService.createBeverageType(beverageType);
      });

    const beverageTypeDeletions = this.beverageTypesFormControls
      .filter(
        (control) => control.value.shouldBeDeleted && !isNaN(control.value.id)
      )
      .map((control) => {
        const beverageType = parseControlValue(control);

        return this.beverageTypeService.deleteBeverageType(beverageType.id);
      });

    forkJoin(
      Array.prototype.concat(
        beverageTypeUpdates,
        beverageTypeCreations,
        beverageTypeDeletions
      )
    )
      .pipe(switchMapTo(this.beverageTypeService.getBeverageTypes()))
      .subscribe((beverageTypes) => {
        this.beverageTypes = beverageTypes;
        this.initBeverageTypeForm();
      });
  }

  onReset(): void {
    this.initBeverageTypeForm();
  }

  addBeverageTypeForm(): void {
    if (this.beverageTypesForm == undefined) return;

    const control = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['0.00', Validators.required],
      shouldBeDeleted: [false],
    });
    control.markAllAsTouched();

    this.beverageTypesForm.push(control);
  }
}
