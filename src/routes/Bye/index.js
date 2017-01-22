import React from "react";
import isEqual from 'lodash.isequal';

const Bye = (props) => (
  <div>
    <p>isEqual: {isEqual({a: 'b'}, {b: 'a'}) ? 'true' : 'false'}</p>
    <input type="text"/>
    <div>
      Bye World from <strong>Bye route</strong>
    </div>
  </div>
);

export default Bye;
