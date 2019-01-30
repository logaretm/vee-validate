import VeeValidate from './plugin';
import mapFields from './core/mapFields';
import { ValidationProvider, ValidationObserver, withValidation } from './components';

VeeValidate.version = '__VERSION__';
VeeValidate.mapFields = mapFields;
VeeValidate.ValidationProvider = ValidationProvider;
VeeValidate.ValidationObserver = ValidationObserver;
VeeValidate.withValidation = withValidation;

export default VeeValidate;
