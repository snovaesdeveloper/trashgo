import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
    selector: 'app-dialogo',
    templateUrl: './dialogo.component.html',
    styleUrls: ['./dialogo.component.css']
})
export class DialogoComponent implements OnInit {

    content: string;

    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    }

    ngOnInit(): void {

        this.content = this.config.data.content;

    }

}
