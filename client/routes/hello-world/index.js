import React from "react";
import isEqual from 'lodash.isequal';

const HelloWord= (props) => (
  <div>
    <p>isEqual: {isEqual({a: 'b'}, {a: 'b'}) ? 'true' : 'false'}</p>
    Hello World from <strong>Hello World route</strong>
  </div>
);

export default HelloWord;
