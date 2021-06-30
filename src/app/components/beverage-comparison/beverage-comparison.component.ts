import { Component, OnInit } from '@angular/core';
import {EChartsOption} from "echarts";
import {PurchaseService} from "@services/purchase/purchase.service";
import {DashboardService} from "@services/dashboard/dashboard.service";
import {map} from "rxjs/operators";
import {PurchaseCount} from "@models/purchase-count";

@Component({
  selector: 'app-beverage-comparison',
  templateUrl: './beverage-comparison.component.html',
})
export class BeverageComparisonComponent implements OnInit {
  chartOptions?: EChartsOption;

  constructor(
    private purchaseService: PurchaseService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardService.purchaseCounts.pipe(map(purchaseCounts =>
      this.getChartOptions(purchaseCounts)
    )).subscribe(chartOptions => this.chartOptions = chartOptions);
  }

  private getChartOptions(
    purchaseCounts: PurchaseCount[]
  ): EChartsOption {
    const min = Math.min(...purchaseCounts.map(purchaseCount => purchaseCount.count));
    const max = Math.max(...purchaseCounts.map(purchaseCount => purchaseCount.count));
    return {
    tooltip: {
        trigger: 'item'
    },
    visualMap: {
        show: false,
        min: min,
        max: max,
        inRange: {
            colorLightness: [0.45, 0.55]
        }
    },
    series: [
        {
            name: 'Verkaufte Getränke',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: purchaseCounts.map(purchaseCount => {
              return {
                name: purchaseCount.beverageType.name,
                value: purchaseCount.count
              }
            }),
            roseType: 'radius',
            label: {
                color: 'rgba(255, 255, 255, 0.7)'
            },
            labelLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.7)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
            },
            itemStyle: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: () => Math.random() * 200
        }
    ]
};
  }
}
