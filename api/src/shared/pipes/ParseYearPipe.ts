import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ParseIntPipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseYearPipe implements PipeTransform<unknown, Promise<number>> {
  private readonly parseIntPipe = new ParseIntPipe();

  async transform(value: unknown, metadata: ArgumentMetadata): Promise<number> {
    let intVal: number;
    if (typeof value === 'number') {
      if (!Number.isInteger(value)) {
        throw new BadRequestException(
          'Validation failed (integer is expected for year)',
        );
      }
      intVal = value;
    } else {
      intVal = await this.parseIntPipe.transform(value as string, metadata);
    }

    if (intVal < 1970 || intVal > 2100) {
      throw new BadRequestException(
        'Validation failed (year must be between 1970 and 2100)',
      );
    }

    return intVal;
  }
}
