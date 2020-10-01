import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const now = Date.now();
const originDate = Date;
global.Date = class extends Date {
  constructor(b: any) {
    super(b === 0 ? b : b || now);
  }
} as DateConstructor;
global.Date.UTC = originDate.UTC;
global.Date.parse = originDate.parse;
global.Date.now = () => now;
