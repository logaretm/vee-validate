import galite from 'ga-lite';
import config from './config';

galite('create', config.gaId, 'auto');
galite('send', 'pageview');
