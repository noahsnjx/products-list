import loginOperations from "./login";
import productOperations from "./products";

function initOperations() {
  return Object.values(productOperations)
    .concat(Object.values(loginOperations))
    .reduce((operations, operation) => {
      return { ...operations, [operation.operationId]: operation };
    }, {});
}

export default initOperations;
