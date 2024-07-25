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

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Integration with Salesforce')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
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
