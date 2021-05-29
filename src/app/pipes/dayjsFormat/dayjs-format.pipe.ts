import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs/esm';
import { Dayjs } from 'dayjs/esm';

@Pipe({
  name: 'dayjsFormat',
})
export class DayjsFormatPipe implements PipeTransform {
  transform(
    date: Dayjs | Date,
    format:
      | 'LT'
      | 'LTS'
      | 'L'
      | 'LL'
      | 'LLL'
      | 'LLLL'
      | 'l'
      | 'll'
      | 'lll'
      | 'llll'
      | 'fromNow'
      | 'fromNowShort' = 'lll',
    relativeTresholdDays: number | undefined = undefined,
    noRelativeSuffix = false
  ): string {
    if (date instanceof Date) date = dayjs(date);

    if (format === 'fromNow') return date.fromNow(noRelativeSuffix);
    else if (relativeTresholdDays != undefined)
      return dayjs().diff(date, 'day') > relativeTresholdDays
        ? date.format(format)
        : date.fromNow(noRelativeSuffix);
    else return date.format(format);
  }
}
