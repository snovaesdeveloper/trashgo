import {UntypedFormControl} from "@angular/forms";

export enum ControlType{
    TEXT = 'TEXT',
    DROPDOWN = 'DROPDOWN',
    DROPDOWN_WITH_VALUE = 'DROPDOWN_WITH_VALUE',
    TEXTAREA = 'TEXTAREA',
    DATE = 'DATE',
    SELECT_ICON = 'SELECT_ICON',
    BADGE = 'BADGE',
    CURRENCY = 'CURRENCY',
}

export default class TableColDefinition {
    name: string;
    title: string;
    display: boolean;
    filter?: boolean;
    sort?: boolean;
    filterField?: string;
    sortField?: string;
    export?: boolean;
    filterType?: string;
    filterInput?: string;
    filterOptions?: {value: any, label: string}[];
    mask?: string;
    control?: UntypedFormControl;
    controlType?: ControlType;
    controlOptions?: {label: any, value: any}[] = [];
    controlMask?: string;
    statusRadioButton?: boolean = false;
    pagoRadioButton?: boolean = false;
}