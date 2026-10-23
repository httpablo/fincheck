import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ParseYearPipe } from './ParseYearPipe';

describe('ParseYearPipe', () => {
  let pipe: ParseYearPipe;
  const metadata: ArgumentMetadata = {
    type: 'query',
    data: 'year',
  };

  beforeEach(() => {
    pipe = new ParseYearPipe();
  });

  it('deve transformar string numérica válida em ano (1970 a 2100)', async () => {
    await expect(pipe.transform('1970', metadata)).resolves.toBe(1970);
    await expect(pipe.transform('2026', metadata)).resolves.toBe(2026);
    await expect(pipe.transform('2100', metadata)).resolves.toBe(2100);
  });

  it('deve aceitar número inteiro válido (1970 a 2100)', async () => {
    await expect(pipe.transform(1970, metadata)).resolves.toBe(1970);
    await expect(pipe.transform(2026, metadata)).resolves.toBe(2026);
    await expect(pipe.transform(2100, metadata)).resolves.toBe(2100);
  });

  it('deve lançar BadRequestException para ano menor que 1970', async () => {
    await expect(pipe.transform('1969', metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (year must be between 1970 and 2100)',
      ),
    );
    await expect(pipe.transform(1969, metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (year must be between 1970 and 2100)',
      ),
    );
  });

  it('deve lançar BadRequestException para ano maior que 2100', async () => {
    await expect(pipe.transform('2101', metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (year must be between 1970 and 2100)',
      ),
    );
    await expect(pipe.transform(2101, metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (year must be between 1970 and 2100)',
      ),
    );
  });

  it('deve lançar BadRequestException para número com casas decimais', async () => {
    await expect(pipe.transform(2026.5, metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (integer is expected for year)',
      ),
    );
  });

  it('deve lançar BadRequestException para valor não numérico', async () => {
    await expect(pipe.transform('abc', metadata)).rejects.toThrow(
      BadRequestException,
    );
    await expect(pipe.transform(null, metadata)).rejects.toThrow(
      BadRequestException,
    );
  });
});
