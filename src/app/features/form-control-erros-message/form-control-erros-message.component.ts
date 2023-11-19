import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
    selector: 'form-control-erros-message',
    templateUrl: './form-control-erros-message.component.html',
    styleUrls: ['./form-control-erros-message.component.scss']
})
export class FormControlErrosMessageComponent implements OnInit {

    @Input() field;

    constructor() {
    }

    ngOnInit(): void {
    }

}
