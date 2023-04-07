import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular-ivy';
import { AppModule } from './app/app.module';

Sentry.init({
  dsn: 'https://415f8b817ed645bebb202692d45953bc@o4504970938023936.ingest.sentry.io/4504970946412544',
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['https://chainbrary.app.runonflux.io'],
      routingInstrumentation: Sentry.routingInstrumentation
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true
    })
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  tracesSampleRate: 1.0
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => console.log(`Bootstrap success`))
  .catch((err) => console.error(err));
