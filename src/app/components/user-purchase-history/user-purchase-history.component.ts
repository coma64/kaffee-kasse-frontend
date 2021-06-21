import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { EChartsOption } from 'echarts';
import dayjs, { Dayjs, OpUnitType } from 'dayjs/esm';
import { forkJoin } from 'rxjs';
import { PurchaseService } from '@services/purchase/purchase.service';
import { map, switchMap } from 'rxjs/operators';
import { DashboardService } from '@services/dashboard/dashboard.service';

@Component({
  selector: 'app-user-purchase-history',
  templateUrl: './user-purchase-history.component.html',
})
export class UserPurchaseHistoryComponent implements OnInit {
  private readonly timePointCount = 27;
  private readonly timePointDistance: OpUnitType = 'day';
  chartOptions?: EChartsOption;

  private readonly colors = [
    '#ff4683',
    '#6344ff',
    '#c044ff',
    '#ff6344',
    '#82ff44',
    '#4482ff',
    '#ff44df',
    '#44ff63',
  ];

  constructor(
    private purchaseService: PurchaseService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const userPurchases = this.dashboardService.topUsers.pipe(
      switchMap((users) =>
        forkJoin(
          users.map((user) =>
            this.purchaseService
              .getList({ userId: user.id, order: 'date' })
              .pipe(
                map((purchases) => {
                  return { user, purchases };
                })
              )
          )
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
          start: 72.5,
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
