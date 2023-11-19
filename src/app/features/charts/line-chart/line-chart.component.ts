import {Component, Input, OnInit} from '@angular/core';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTitleSubtitle,
    ApexStroke,
    ApexGrid, ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

    chartOptions: Partial<ChartOptions>;
    @Input("title") title: string;

    _chart: {labels: string[], series: {name?: string, data: number[]}[]} = {labels: [], series: [{name: '', data: []}]};
    @Input("chart") set chart(chart: {labels: string[], series: {name?: string, data: number[]}[]}){
       this._chart = chart;
       this.ngOnInit();
    }

    constructor() {
    }

    ngOnInit(): void {

        if(!this._chart.labels || !this._chart.labels.length)
            return;

        this.chartOptions = {
            series: this._chart.series,
            chart: {
                type: "line",
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "smooth"
            },
            title: {
                text: this.title,
                align: "center"
            },
            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5
                }
            },
            yaxis: {
                labels: {
                    formatter(val: number): string {
                        return "R$ "+val?.toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    }
                }
            },
            xaxis: {
                categories: this._chart.labels
            }
        };

    }

}
