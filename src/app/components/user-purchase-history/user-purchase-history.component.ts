import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { User } from '@models/user';
import { EChartsOption } from 'echarts';
import dayjs, { Dayjs, OpUnitType } from 'dayjs/esm';
import { forkJoin } from 'rxjs';
import { PurchaseService } from '@services/purchase/purchase.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-purchase-history',
  templateUrl: './user-purchase-history.component.html',
})
export class UserPurchaseHistoryComponent implements OnInit, OnChanges {
  @Input() users!: User[];
  @Input() timePointCount = 27;
  @Input() timePointDistance: OpUnitType = 'day';
  chartOptions?: EChartsOption;

  private readonly colors = [
    '#ff4683',
    '#6344ff',
    '#ff6344',
    '#ff4482',
    '#4482ff',
    '#ff44df',
    '#c044ff',
  ];

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.initChart();
  }

  ngOnChanges(): void {
    this.initChart();
  }

  private initChart(): void {
    const userPurchases = forkJoin(
      this.users.map((user) =>
        this.purchaseService.getList({ userId: user.id, order: 'date' }).pipe(
          map((purchases) => {
            return { user, purchases };
          })
        )
      )
    );

    userPurchases
      .pipe(
        map((userPurchases) =>
          userPurchases.map(({ user, purchases }) => {
            const timePoints = this.timePoints;
            const purchasesDayjs = purchases.map((purchase) => {
              return {
                id: purchase.id,
                user: purchase.user,
                beverage_type: purchase.beverage_type,
                date: dayjs(purchase.date),
              };
            });

            const purchaseCounts: number[] = [];
            for (const timePoint of timePoints) {
              purchaseCounts.push(
                purchasesDayjs.reduce(
                  (count, purchase) =>
                    purchase.date <= timePoint ? count + 1 : count,
                  0
                )
              );
            }

            return { user, purchaseCounts };
          })
        ),
        map((purchaseCounts) => this.getChartOptions(purchaseCounts))
      )
      .subscribe((chartOptions) => (this.chartOptions = chartOptions));
  }

  private getChartOptions(
    purchaseCounts: { user: User; purchaseCounts: number[] }[]
  ): EChartsOption {
    const aMonthAgo = dayjs().subtract(1, 'month');
    return {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: this.timePoints.map((timePoint) => {
          return timePoint <= aMonthAgo
            ? timePoint.format('lll')
            : timePoint.fromNow();
        }),
        boundaryGap: true,
      },
      yAxis: {
        type: 'value',
      },
      dataZoom: [
        {
          type: 'slider',
          start: 75,
          end: 100,
        },
      ],
      legend: {
        type: 'plain',
        textStyle: {
          color: '#fff',
        },
      },
      series: purchaseCounts.map((purchaseCount, index) => {
        return {
          data: purchaseCount.purchaseCounts,
          name: purchaseCount.user.username,
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: this.colors[index % this.colors.length],
          },
        };
      }),
    };
  }

  private get timePoints(): Dayjs[] {
    const today = dayjs();

    return [...Array(this.timePointCount)].map((_, index) =>
      today.subtract(this.timePointCount - 1 - index, this.timePointDistance)
    );
  }
}
