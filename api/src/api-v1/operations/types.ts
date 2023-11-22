type Operation = ((...args: any[]) => void) & {
  operationId: string;
};

type Operations = {
  [method: string]: Operation;
};

export { Operations };
