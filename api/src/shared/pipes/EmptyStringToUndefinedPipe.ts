import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmptyStringToUndefinedPipe implements PipeTransform {
  transform(value: unknown) {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined;
    }
    return value;
  }
}
