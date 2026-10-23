import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ParseIntPipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseMonthPipe implements PipeTransform<unknown, Promise<number>> {
  private readonly parseIntPipe = new ParseIntPipe();

  async transform(value: unknown, metadata: ArgumentMetadata): Promise<number> {
    let intVal: number;
    if (typeof value === 'number') {
      if (!Number.isInteger(value)) {
        throw new BadRequestException(
          'Validation failed (integer is expected for month)',
        );
      }
      intVal = value;
    } else {
      intVal = await this.parseIntPipe.transform(value as string, metadata);
    }

    if (intVal < 0 || intVal > 11) {
      throw new BadRequestException(
        'Validation failed (month must be between 0 and 11)',
      );
    }

    return intVal;
  }
}
