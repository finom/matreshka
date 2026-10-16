import type { Binder } from '../types.js';

// a node the binder took out of the DOM points at the comment left in its place
type ExistenceNode = Element & { __replacedByNode?: Comment };

// returns a binder which removes a node from DOM (leaving a comment in its place) or puts it back
export default function existence(switcher: boolean | ((value: any) => any) = true): Binder {
  // one binder can be bound to many nodes, so every node gets its own comment
  const comments = new WeakMap<Element, Comment>();

  return {
    setValue(this: ExistenceNode, value: any) {
      let comment = comments.get(this);

      if (!comment) {
        const { tagName, id, classList, className } = this;
        let commentText = tagName;

        if (id) {
          commentText += `#${id}`;
        }

        if (className) {
          commentText += `.${[...classList].join('.')}`;
        }

        comment = window.document.createComment(commentText);
        comments.set(this, comment);
      }

      let exists = value;

      if (typeof switcher === 'function') {
        exists = switcher(value);
      } else if (!switcher) {
        exists = !value;
      }

      if (exists) {
        // __replacedByNode is read by Matreshka.Array rendering
        delete this.__replacedByNode;

        if (comment.parentNode) {
          comment.parentNode.insertBefore(this, comment);
          comment.parentNode.removeChild(comment);
        }
      } else {
        this.__replacedByNode = comment;

        if (this.parentNode) {
          this.parentNode.insertBefore(comment, this);
          this.parentNode.removeChild(this);
        }
      }
    }
  };
}
