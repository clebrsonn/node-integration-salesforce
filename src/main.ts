import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as exphbs from 'express-handlebars';
import * as session from 'express-session';
import * as passport from 'passport';
import flash = require('connect-flash');
import { AuthExceptionFilter } from './auth-exception/auth-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AuthExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Integration with Salesforce')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.engine(
    'hbs',
    exphbs.create({
      extname: 'hbs',
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views'),
      helpers: {
        statusClass: function (status: string) {
          switch (status) {
            case 'InProgress':
              return 'table-primary';
            case 'Failed':
              return 'table-danger';
            case 'Succeeded':
              return 'table-success';
            default:
              return 'table-warning';
          }
        },
      },
    }).engine,
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setViewEngine('hbs');

  app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
