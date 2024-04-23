import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppValidationPipe } from './common/pipes/app-validation.pipe';
import { ApiErrorFilter } from './common/pipes/filter-error.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new AppValidationPipe());
  app.useGlobalFilters(new ApiErrorFilter());
  app.enableCors();
  await app.listen(1337);
}
bootstrap();
