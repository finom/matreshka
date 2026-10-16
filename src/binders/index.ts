import html from './html.js';
import display from './display.js';
import className from './classname.js';
import prop from './prop.js';
import attr from './attr.js';
import text from './text.js';
import style from './style.js';
import dataset from './dataset.js';
import existence from './existence.js';
import input from './input.js';
import output from './output.js';
import textarea from './textarea.js';
import select from './select.js';
import progress from './progress.js';

// a plain object, not the module namespace, so Matreshka.binders.myBinder = … adds a binder
const binders = {
  html,
  display,
  className,
  prop,
  attr,
  input,
  output,
  textarea,
  select,
  progress,
  text,
  style,
  dataset,
  existence
};

export default binders;

export {
  html,
  display,
  className,
  prop,
  attr,
  input,
  output,
  textarea,
  select,
  progress,
  text,
  style,
  dataset,
  existence
};
