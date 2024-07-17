// src/app/decorators/global-expose.decorator.ts
export
function GlobalExpose(key: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    (window as any)[key] = function (...args: any[]) {
      return originalMethod.apply(target.instance, args);
    };
  };
}
