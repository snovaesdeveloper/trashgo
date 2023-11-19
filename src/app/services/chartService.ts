import {EventEmitter, Injectable} from '@angular/core';
import ApexCharts, { ApexOptions } from "apexcharts";

export class InterfaceDadosGraficos{
    labels: string[];
    data: number[][];
    options?: any;
}

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    charts: EventEmitter<Map<string, InterfaceDadosGraficos>> = new EventEmitter<Map<string, InterfaceDadosGraficos>>();

}
