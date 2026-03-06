import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { DomainException } from './domain-exceptions';
import { DomainExceptionCode } from './domain-exception-codes';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const oneKb = 10485760;

    if (value.size > oneKb) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: `Size over 10МБ`,
      });
    }

    console.log(value);

    if (value.mimetype !== 'image/jpeg' && value.mimetype !== 'image/png') {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: `File must be in JPEG or PNG format`,
      });
    }

    return value;
  }
}
