import React from "react";
import isEqual from 'lodash.isequal';

const Bye = (props) => (
  <div>
    <p>isEqual: {isEqual({a: 'b'}, {b: 'a'}) ? 'true' : 'false'}</p>
    <input type="text"/>
    <div>
      Bye fucking World from <strong>Bye route</strong>
    </div>
  </div>
);

export default Bye;
