import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {NgxMaskService} from "ngx-mask";
import {UtilService} from "../../services/util.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-confirmacao',
    templateUrl: './confirmacao.component.html',
    styleUrls: ['./confirmacao.component.scss'],
})
export class ConfirmacaoComponent implements OnInit {

    content: string;
    form: UntypedFormGroup;

    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private formBuilder: UntypedFormBuilder) {
    }

    ngOnInit(): void {

        this.form = this.formBuilder.group({
            motivo: ['', [
                Validators.required
            ]],
        });


        this.content = this.config.data.content;

    }

    cancelar() {
        this.ref.close(false);
    }

    confirmar() {

        if (this.config.data.returnValue) {

            if (this.form.valid) {
                this.ref.close(this.form.get('motivo').value);
            } else {
                this.form.markAllAsTouched();
            }

        } else {
            this.ref.close(true);
        }

    }
}
