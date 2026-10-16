import html2nodeList from './_html2nodelist';
import Init from './_init';

// parses given HTML and returns mq instance
export default function parseHTML(html) {
  return new Init(html2nodeList(html));
}
