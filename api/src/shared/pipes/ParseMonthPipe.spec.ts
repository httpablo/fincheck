import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ParseMonthPipe } from './ParseMonthPipe';

describe('ParseMonthPipe', () => {
  let pipe: ParseMonthPipe;
  const metadata: ArgumentMetadata = {
    type: 'query',
    data: 'month',
  };

  beforeEach(() => {
    pipe = new ParseMonthPipe();
  });

  it('deve transformar string numérica válida em número (0 a 11)', async () => {
    await expect(pipe.transform('0', metadata)).resolves.toBe(0);
    await expect(pipe.transform('5', metadata)).resolves.toBe(5);
    await expect(pipe.transform('11', metadata)).resolves.toBe(11);
  });

  it('deve aceitar número inteiro válido (0 a 11)', async () => {
    await expect(pipe.transform(0, metadata)).resolves.toBe(0);
    await expect(pipe.transform(6, metadata)).resolves.toBe(6);
    await expect(pipe.transform(11, metadata)).resolves.toBe(11);
  });

  it('deve lançar BadRequestException para mês menor que 0', async () => {
    await expect(pipe.transform('-1', metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (month must be between 0 and 11)',
      ),
    );
    await expect(pipe.transform(-1, metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (month must be between 0 and 11)',
      ),
    );
  });

  it('deve lançar BadRequestException para mês maior que 11', async () => {
    await expect(pipe.transform('12', metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (month must be between 0 and 11)',
      ),
    );
    await expect(pipe.transform(12, metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (month must be between 0 and 11)',
      ),
    );
  });

  it('deve lançar BadRequestException para número com casas decimais', async () => {
    await expect(pipe.transform(5.5, metadata)).rejects.toThrow(
      new BadRequestException(
        'Validation failed (integer is expected for month)',
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
