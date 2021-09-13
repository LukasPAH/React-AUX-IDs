import React from "react";
import Foo from "./Foo";

const Components = {
    foo: Foo
};

const ComponentType = 'foo'

export default aux => {
    return React.createElement(Components[ComponentType], {
        aux: aux
    });
};
